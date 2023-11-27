const Storage = {};

// QUERRY SELECTORS
const DisplayUsername = document.getElementById("username");
const currentUserSelector = document.getElementById("current-user-name");
const UserGivenName = document.getElementById("user-given-name");
const UserPhoneNumber = document.getElementById("user-phone-number");
const UserAge = document.getElementById("user-age");
const UserEmail = document.getElementById("user-email");
const updateButton = document.querySelector(".update-button");

// AJAX CALLS
const updateUserDetails = (data) => {
  $.ajax({
    url: "/php/update.php",
    method: "POST",
    data: data,
    success: (response) => {
      console.log("Response:", response);
      Storage.newUser = false;
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error:", textStatus, errorThrown);
    },
  });
};

const getUserDetails = (data) => {
  $.ajax({
    url: "/php/profile.php",
    method: "GET",
    data: data,
    success: (response) => {
      console.log("Response:", response);

      const { status, userDetails } = response;
      if (!status) {
        setFormValues(null);
        Storage.newUser = true;
        Storage.username = localStorage.getItem("username");
      } else {
        const { username, UserGivenName, UserPhoneNumber, UserAge, UserEmail } = userDetails;
        setFormValues({ UserGivenName, UserPhoneNumber, UserAge, UserEmail });
        Storage.newUser = false;
        Storage.username = localStorage.getItem("username");
      }
      updateUI();
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error:", textStatus, errorThrown);
    },
  });
};

// FUNCTIONS
const setFormValues = ({ UserGivenName, UserPhoneNumber, UserAge, UserEmail }) => {
  UserGivenName.value = UserGivenName || "";
  UserPhoneNumber.value = UserPhoneNumber ? parseInt(UserPhoneNumber) : 0;
  UserAge.value = UserAge ? parseInt(UserAge) : 0;
  UserEmail.value = UserEmail || "";
};

const getFormValues = () => ({
  username: Storage.username,
  UserGivenName: UserGivenName.value,
  UserPhoneNumber: UserPhoneNumber.value,
  UserAge: UserAge.value,
  UserEmail: UserEmail.value,
});

const updateUI = () => {
  currentUserSelector.innerHTML = Storage.username;
};

// EVENT LISTENERS
window.addEventListener("load", () => {
  const isLogin = Boolean(localStorage.getItem("isLogin"));
  if (isLogin) {
    const data = localStorage.getItem("session_id");
    getUserDetails({ redisID: data });
  } else {
    // Redirect to login page or show an alert
    // alert("Login to continue");
    // window.location.href = "/login.html";
  }
});

updateButton.addEventListener("click", (e) => {
  e.preventDefault();
  updateUserDetails({
    details: getFormValues(),
    isSaved: Storage.newUser,
    username: Storage.username,
  });
});

updateUI();
