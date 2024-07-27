const databaseURL =
  "https://users-f61ab-default-rtdb.europe-west1.firebasedatabase.app/";

let contactBase = [];

/**
 * Redirects the user to the privacy policy page.
 */
function redirectToPrivacyPage() {
  window.location.href = "./privacy_policy.html";
}

/**
 * Redirects the user to the legal notice page.
 */
function redirectToLegalPage() {
  window.location.href = "./legal_notice.html";
}

/**
 * Redirects the user to the login page.
 */
function redirectToLoginPage() {
  window.location.href = "../index.html";
}

// Sign up button

/**
 * Adds event listeners to set up signup button functionality and checkbox toggle on DOM content loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  buttonDisabled();
  checkboxToggle();
});

/**
 * Disables the signup button initially.
 */
function buttonDisabled() {
  const signupButton = document.querySelector("#signupButton");
  signupButton.disabled = true;
}

/**
 * Toggles the signup button enabled/disabled state based on the 'rememberMe' checkbox state.
 */
function checkboxToggle() {
  const checkbox = document.querySelector("#rememberMe");
  const signupButton = document.querySelector("#signupButton");

  checkbox.addEventListener("change", () => {
    signupButton.disabled = !checkbox.checked;
  });
}

/**
 * Sets up password visibility toggle functionality for password input fields on DOM content loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  setupPasswordVisibilityToggle("signupPasswordInput", "signupLockIcon");
  setupPasswordVisibilityToggle(
    "signupConfirmPassword",
    "signupValidationLockIcon"
  );
});

/**
 * 
 * Sets up password visibility toggle for a given password input and lock icon.
 * @param {string} passwordInputId - The ID of the password input element.
 * @param {string} lockIconId - The ID of the lock icon element.
 */
function setupPasswordVisibilityToggle(passwordInputId, lockIconId) {
  const passwordInput = document.getElementById(passwordInputId);
  const lockIcon = document.getElementById(lockIconId);

  passwordInput.addEventListener("input", () =>
    updateLockIcon(passwordInput, lockIcon)
  );
  lockIcon.addEventListener("click", () =>
    togglePasswordVisibility(passwordInput, lockIcon)
  );
}

/**
 * 
 * Updates the lock icon based on the password input length.
 * @param {HTMLElement} passwordInput - The password input element.
 * @param {HTMLElement} lockIcon - The lock icon element.
 */
function updateLockIcon(passwordInput, lockIcon) {
  lockIcon.src =
    passwordInput.value.length > 0
      ? "../assets/img/visibility_off.png"
      : "../assets/img/lockIcon.png";
}

/**
 * 
 * Toggles the visibility of the password input.
 * @param {HTMLElement} passwordInput - The password input element.
 * @param {HTMLElement} lockIcon - The lock icon element.
 */
function togglePasswordVisibility(passwordInput, lockIcon) {
  const passwordVisible = passwordInput.type === "password";
  lockIcon.src = passwordVisible
    ? "../assets/img/visibility_on.png"
    : "../assets/img/visibility_off.png";
  passwordInput.type = passwordVisible ? "text" : "password";
}

/**
 * 
 * Loads data from the specified path in the Firebase Realtime Database.
 * @param {string} [path=""] - The path to load data from.
 * @returns {Promise<object>} A promise that resolves to the JSON response from the database.
 */
async function onloadDatabase(path = "") {
  let response = await fetch(databaseURL + path + ".json");
  let responseToJson = await response.json();
  contactBase = responseToJson;
  return responseToJson;
}

/**
 * 
 * Posts data to the specified path in the Firebase Realtime Database.
 * @param {string} [path=""] - The path to post data to.
 * @param {object} [data={}] - The data to post.
 * @returns {Promise<object>} A promise that resolves to the JSON response from the database.
 * @throws Will throw an error if the data posting fails.
 */
async function postData(path = "", data = {}) {
  try {
    let response = await fetch(`${databaseURL}${path}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

/**
 * 
 * Handles the signup process by validating the form, resetting error messages, 
 * checking email existence, creating a new user, and posting the user data to the database.
 */
async function signup() {
  const name = document.getElementById("signupNameInput").value;
  const email = document.getElementById("signupEmailInput").value;
  const password = document.getElementById("signupPasswordInput").value;
  const confirmPassword = document.getElementById(
    "signupConfirmPassword"
  ).value;

  if (!validateSignupForm(name, email, password, confirmPassword)) return;

  resetErrorMessages();

  try {
    await handleEmailCheckAndUserCreation(name, email, password);
  } catch (error) {
    handleSignupError(error);
  }
}

/**
 * 
 * Displays a custom error message temporarily.
 * @param {string} message - The custom error message to display.
 */
function displayCustomErrorMessage(message) {
  const customErrorMessage = document.getElementById("customErrorMessage");
  customErrorMessage.textContent = message;
  customErrorMessage.style.display = "block";
  setTimeout(() => {
    customErrorMessage.style.display = "none";
  }, 3000);
}

/**
 * 
 * Handles email check and user creation process.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 */
async function handleEmailCheckAndUserCreation(name, email, password) {
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    displayCustomErrorMessage("Email address is already registered.");
    return;
  }

  const newUser = createNewUser(name, email, password);
  const response = await postData("users", newUser);

  if (response) {
    handleSuccessfulSignup();
  } else {
    console.error("Error saving user to database:", response);
  }
}

/**
 * 
 * Validates the signup form by checking field completeness, email validity, and password match.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {boolean} True if the form is valid, otherwise false.
 */
function validateSignupForm(name, email, password, confirmPassword) {
  if (!areFieldsFilled(name, email, password, confirmPassword)) {
    displayCustomErrorMessage("Please fill in all fields.");
    return false;
  }

  if (!isEmailValid(email)) {
    displayCustomErrorMessage("Please enter a valid email address.");
    return false;
  }

  if (!arePasswordsMatching(password, confirmPassword)) {
    showError();
    return false;
  }

  return true;
}

/**
 * 
 * Checks if all signup form fields are filled.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {boolean} True if all fields are filled, otherwise false.
 */
function areFieldsFilled(name, email, password, confirmPassword) {
  return name && email && password && confirmPassword;
}

/**
 * 
 * Validates the email format using a regular expression.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email is valid, otherwise false.
 */
function isEmailValid(email) {
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.(com|de|org|net|edu|gov|mil|info|io|co)$/;
  return emailPattern.test(email);
}

/**
 * 
 * Checks if the password and confirm password fields match.
 * @param {string} password - The password of the user.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {boolean} True if the passwords match, otherwise false.
 */
function arePasswordsMatching(password, confirmPassword) {
  return password === confirmPassword;
}

/**
 * 
 * Shows an error message for password mismatch and adds error styling to the confirm password field.
 */
function showError() {
  document.getElementById("errorMessage").style.display = "block";
  document.getElementById("signupConfirmPassword").classList.add("error");
}

/**
 * 
 * Resets error messages and removes error styling from the confirm password field.
 */
function resetErrorMessages() {
  document.getElementById("errorMessage").style.display = "none";
  document.getElementById("signupConfirmPassword").classList.remove("error");
}

/**
 * 
 * Creates a new user object with the given name, email, and password.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {object} The new user object.
 */
function createNewUser(name, email, password) {
  return {
    name: name,
    email: email,
    password: password,
    login: false,
  };
}

/**
 * 
 * Handles successful signup by showing an overlay and redirecting to the login page.
 */
function handleSuccessfulSignup() {
  const overlay = document.getElementById("overlay");
  overlay.classList.add("show");

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 2000);
}

/**
 * 
 * Handles signup error by logging the error and displaying an alert with the error message.
 * @param {Error} error - The error that occurred during signup.
 */
function handleSignupError(error) {
  console.error("Error creating user:", error.message);
  alert("Error creating user: " + error.message);
}

/**
 * 
 * Checks if an email address already exists in the database.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the email exists, otherwise false.
 * @throws Will throw an error if the email check fails.
 */
async function checkEmailExists(email) {
  try {
    const response = await fetch(`${databaseURL}users.json`);
    const data = await response.json();

    if (data) {
      const users = Object.values(data);
      return users.some((user) => user.email === email);
    }
    return false;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
}
