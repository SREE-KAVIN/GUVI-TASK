// DOCUMENT SELECTORS
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const loginButton = document.querySelector(".Login-button");
const errorMessage = document.querySelector(".err");

// FUNCTIONS
const validateUserName = (value) => {
  return value.trim() !== ""; // Use trim to remove leading/trailing whitespaces
};

const validatePassword = (value) => {
  return value.trim() !== ""; // Use trim to remove leading/trailing whitespaces
};

// AJAX CALL
const registerUser = (username, password) => {
  const data = {
    username,
    password,
  };

  $.ajax({
    url: "/php/register.php",
    method: "POST",
    data: data,
    success: function (response) {
      // Handle the response from the server
      console.log("Response:", response);

      // Parse the JSON response
      const parsedResponse = JSON.parse(response);

      if (parsedResponse.status) {
        // Registration successful
        console.log("Registration successful");
      } else {
        // Registration failed
        console.error("Registration failed:", parsedResponse.message);
        // Display error message in the UI
        errorMessage.textContent = parsedResponse.message;
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle any errors that occurred during the request
      console.error("Error:", textStatus, errorThrown);
      // Display a generic error message in the UI
      errorMessage.textContent = "An error occurred. Please try again later.";
    },
  });
};

// EVENT LISTENERS
loginButton.addEventListener("click", (e) => {
  e.preventDefault();

  // Get input values
  const usernameValue = username.value;
  const passwordValue = password.value;
  const confirmPasswordValue = confirmPassword.value;

  // Validate inputs
  if (!validateUserName(usernameValue) || !validatePassword(passwordValue)) {
    // Display an error message for invalid inputs
    errorMessage.textContent = "Please enter a valid username and password.";
    return;
  }

  // Check if password and confirm password match
  if (passwordValue !== confirmPasswordValue) {
    errorMessage.textContent = "Passwords do not match.";
    return;
  }

  // Clear any previous error messages
  errorMessage.textContent = "";

  // Call the registerUser function
  registerUser(usernameValue, passwordValue);
});
