/**
 * 
 * Deletes a contact by ID.
 * @param {string} id - The ID of the contact to be deleted.
 */
async function deleteContact(id) {
  try {
    await deleteData(id);
    handleContactDeletion(id);
  } catch (error) {
    handleDeleteError(error);
  }
}

/**
 * 
 * Handles the deletion of a contact from the local contacts array and updates the UI.
 * @param {string} id - The ID of the contact to be deleted.
 */
function handleContactDeletion(id) {
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index !== -1) {
    contacts.splice(index, 1);
    showContacts();
    clearFullscreenContacts();
    hideEditContactOverlay();
    setBg();
  } else {
    console.error("Contact not found:", id);
  }
}

/**
 * 
 * Handles errors that occur during contact deletion from Firebase.
 * @param {Error} error - The error object.
 */
function handleDeleteError(error) {
  console.error("Error deleting contact from Firebase:", error);
}

/**
 * Clears the fullscreen contact details.
 */
function clearFullscreenContacts() {
  document.getElementById("contactsFullscreen").innerHTML = "";
}

// Function to hide edit contact overlay
/**
 * Hides the edit contact overlay.
 */
function hideEditContactOverlay() {
  const editContactOverlay = document.querySelector(".editContactOverlay");
  editContactOverlay.classList.add("hidden");
  editContactOverlay.classList.remove("visible");
}

/**
 * 
 * Displays the initials of a contact in the edit overlay.
 * @param {Object} contact - The contact object.
 */
function displayContactInitials(contact) {
  const contactInitialsEdit = document.getElementById("contactInitialsEdit");
  contactInitialsEdit.textContent = getInitials(contact.name);
  setBg();
}

/**
 * 
 * Opens the edit contact overlay with the contact's details.
 * @param {Object} contact - The contact object.
 */
function editContact(contact) {
  displayContactInitials(contact);

  document.getElementById("editNameInput").value = contact.name || "";
  document.getElementById("editEmailInput").value = contact.email || "";
  document.getElementById("editPhoneInput").value = contact.phone || "";

  currentContact = contacts.findIndex((c) => c.id === contact.id);

  document.querySelector(".editContactOverlay").classList.remove("hidden");
  document.querySelector(".editContactOverlay").classList.add("visible");

  const deleteButton = document.getElementById("editDeleteButton");
  deleteButton.setAttribute("onclick", `deleteContact('${contact.id}')`);
}

/**
 * Saves the edited contact details.
 */
async function saveContact() {
  const editedContact = getEditedContact();
  if (!editedContact) return;

  const contactId = getContactId();
  if (!contactId) return;

  try {
    await putData(`${contactId}`, editedContact);
    await fetchAndShowContacts();
    showContactDetails(currentContact);
    setBg();
  } catch (error) {
    console.error("Error:", error);
  }

  hideEditContactOverlay();
}

/**
 * 
 * Retrieves the edited contact details from input fields.
 * @returns {Object} - The edited contact details.
 */
function getEditedContact() {
  return {
    name: document.getElementById("editNameInput").value,
    email: document.getElementById("editEmailInput").value,
    phone: document.getElementById("editPhoneInput").value,
  };
}

/**
 * 
 * Retrieves the ID of the current contact.
 * @returns {string|null} - The ID of the current contact, or null if not found.
 */
function getContactId() {
  const contactId = contacts[currentContact]?.id;
  if (!contactId) {
    console.error("No valid contact ID found");
    return null;
  }
  return contactId;
}

/**
 * Fetches updated contacts and displays them.
 */
async function fetchAndShowContacts() {
  try {
    await fetchContacts();
    showContacts();
    showContactDetails(currentContact);
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
}

/**
 * Creates a new contact.
 */
async function createContact() {
  let nameInput = document.getElementById("createNameInput");
  let emailInput = document.getElementById("createEmailInput");
  let phoneInput = document.getElementById("createPhoneInput");
  let errorMessageContacts = document.getElementById("errorMessageContacts");

  try {
    await processContact(nameInput, emailInput, phoneInput, errorMessageContacts);
  } catch (error) {
    handleCreateContactError(error, errorMessageContacts);
  }
}

/**
 * 
 * Processes the creation of a new contact.
 * @param {HTMLElement} nameInput - The input element for the contact's name.
 * @param {HTMLElement} emailInput - The input element for the contact's email.
 * @param {HTMLElement} phoneInput - The input element for the contact's phone.
 * @param {HTMLElement} errorMessageContacts - The element for displaying error messages.
 */
async function processContact(nameInput, emailInput, phoneInput) {
  await checkAndSaveContact(nameInput.value, emailInput.value, phoneInput.value);
  clearInputs(nameInput, emailInput, phoneInput);
  hideContactOverlay();
  await fetchAndShowContacts();
}

/**
 * 
 * Handles errors that occur during contact creation.
 * @param {Error} error - The error object.
 * @param {HTMLElement} errorMessageContacts - The element for displaying error messages.
 */
function handleCreateContactError(error, errorMessageContacts) {
  if (error.message === "Duplicate email") {
    displayErrorContacts(errorMessageContacts, "Email address is already registered.");
  } else {
    displayErrorContacts(errorMessageContacts, "An error occurred while creating the contact.");
  }
}

/**
 * 
 * Displays an error message for contacts.
 * @param {HTMLElement} element - The element to display the error message in.
 * @param {string} message - The error message to display.
 */
function displayErrorContacts(element, message) {
  element.textContent = message;
  element.style.display = "block";
  setTimeout(function () {
    element.style.display = "none";
  }, 3000);
}

/**
 * 
 * Checks if the email exists and saves the new contact.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @throws Will throw an error if the email is already registered.
 */
async function checkAndSaveContact(name, email, phone) {
  const emailExists = await checkEmailExists(email);
  if (emailExists) throw new Error("Duplicate email");

  let newID = await generateCustomID();
  let contact = { name, email, phone };

  try {
    await saveContactToFirebase(newID, contact);
    await showContactCreationOverlay();
  } catch (error) {
    throw new Error("Error saving contact");
  }
}

/**
 * 
 * Saves the new contact to Firebase.
 * @param {string} id - The ID of the new contact.
 * @param {Object} contact - The contact object.
 * @throws Will throw an error if the contact cannot be added to Firebase.
 */
async function saveContactToFirebase(id, contact) {
  try {
    await putData(id, contact);
    contacts.push({ id, ...contact });
  } catch (error) {
    console.error("Error adding contact to Firebase:", error);
    throw error;
  }
}

/**
 * Displays the overlay for contact creation.
 */
async function showContactCreationOverlay() {
  const overlay = document.querySelector(".contactCreatedOverlay");
  overlay.classList.remove("contactCreatedOverlayHidden");

  if (window.innerWidth >= 1290) {
    overlay.classList.add("slideInRight");
  } else {
    overlay.classList.add("slideInUp");
  }

  await animateOverlay(overlay);
}

/**
 * 
 * Animates the contact creation overlay.
 * @param {HTMLElement} overlay - The overlay element.
 */
async function animateOverlay(overlay) {
  void overlay.offsetWidth;
  overlay.classList.add("in");

  setTimeout(async () => {
    overlay.classList.remove("in");
    overlay.classList.add("out");

    setTimeout(() => {
      overlay.classList.remove("slideInRight", "slideInUp", "out");
    }, 800);

    await fetchAndShowContacts();
    setBg();
  }, 3000);
}

/**
 * 
 * Fetches and displays the contacts.
 */
async function fetchAndShowContacts() {
  try {
    await fetchContacts();
    showContacts();
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
}

/**
 * 
 * Clears the values of input fields.
 * @param {...HTMLElement} inputs - The input elements to clear.
 */
function clearInputs(...inputs) {
  inputs.forEach((input) => (input.value = ""));
}

/**
 * 
 * Checks if an email already exists in the list of contacts.
 * @param {string} email - The email address to check.
 * @returns {boolean} - True if the email exists, false otherwise.
 */
async function checkEmailExists(email) {
  await fetchContacts();
  return contacts.some((contact) => contact.email === email);
}

/**
 * 
 * Generates a custom ID for a new contact based on the current list of contacts.
 * @returns {string} - The generated custom ID.
 */
async function generateCustomID() {
  await fetchContacts();

  const nextID = contacts.length + 1;
  return `contact${nextID}`;
}

/**
 * Hides the contact creation overlay.
 */
function hideContactOverlay() {
  const overlay = document.getElementById("contactOverlay");
  overlay.classList.add("hidden");
}
