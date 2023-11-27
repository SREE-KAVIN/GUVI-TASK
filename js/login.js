// SECTION-START: DOCUMENT QUERY SELECTORS
const error = document.querySelector(".err");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.querySelector(".Login-button");
const errorMessage = document.querySelector(".err");
// SECTION-END: DOCUMENT QUERY SELECTORS

const loginUser = (username, password) => {
  const data = {
    username,
    password,
  };

  $.ajax({
    url: "/php/login.php",
    method: "POST",
    data: data,
    success: (response) => {
      // Handle the response from the server
      console.log(response);
      try {
        const { status, message, data, session_id } = JSON.parse(response);

        if (status) {
          localStorage.setItem("isLogin", true);
          localStorage.setItem("session_id", session_id);
          localStorage.setItem("username", data.username);
          window.location.href = "/profile.html";
        } else {
          // Use a more user-friendly error message
          alert("Login failed. Please check your credentials.");
          // Optionally update error message in the UI
          // errorMessage.innerHTML = "Login failed. Please check your credentials.";
        }
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("Error:", textStatus, errorThrown);
      // Optionally update error message in the UI
      // errorMessage.innerHTML = "An error occurred. Please try again later.";
    },
  });
};

// SECTION-START: EVENT LISTENERS
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Login button clicked");
  const usernameValue = username.value.trim(); // Trim to remove leading/trailing whitespaces
  const passwordValue = password.value.trim(); // Trim to remove leading/trailing whitespaces

  if (!usernameValue || !passwordValue) {
    // Validate that both username and password are provided
    alert("Please enter both username and password.");
    return;
  }

  loginUser(usernameValue, passwordValue);
});
// SECTION-END: EVENT LISTENERS
