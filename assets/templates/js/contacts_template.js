/**
 * 
 * Generates the HTML structure for displaying the contact details on the right side and inserts it into the page.
 * @param {Object} contact - The contact object containing details.
 * @param {number} index - The index of the contact in the contact list.
 */
function createContactDetailsHTML(contact, index) {
  document.getElementById("contactsFullscreen").innerHTML = `
      <div class="fullContactDetails">
        <div class="fullContactHeader">
          <div class="contactDetailsInitials">${getInitials(contact.name)}</div>
          <div class="contactNameButtons"><div class="contactDetailsName">${
            contact.name
          }</div>
          <div class="contactDetailsButtons">
            <button class="editContactButton" onclick="editContact()">
              <img class="editImg" src="../assets/img/edit.svg" alt="Edit" /> Edit
            </button>
            <button class="deleteContactButton" onclick="deleteContact('${
              contact.id
            }')">
              <img class="deleteImg" src="../assets/img/delete.svg" alt="Delete" /> Delete
            </button>
          </div>
          </div>
        </div>
        <div class="contactInfoHeader">Contact Information</div>
        <div class="contactInfoDetails">
          <div class="contactInfoEmail">
            <div class="contactInfoLabelEmail">Email</div>
            <div class="contactInfoValueEmail">${contact.email}</div>
          </div>
          <div class="contactInfoPhone">
            <div class="contactInfoLabelPhone">Phone</div>
            <div class="contactInfoValuePhone">${contact.phone}</div>
          </div>
        </div>
      </div>
    `;
  setBg();
}

/**
 * Opens the overlay for adding a new contact.
 */
function openOverlay() {
  document.querySelector(".addNewContactOverlay").classList.remove("hidden");
  document.querySelector(".addNewContactOverlay").classList.add("visible");
}

/**
 * Closes the overlay for adding a new contact when the close button is clicked.
 */
document.getElementById("closeOverlay").addEventListener("click", function () {
  document.getElementById("contactOverlay").classList.add("hidden");
  document.getElementById("contactOverlay").classList.remove("visible");
});

/**
 * Closes the overlay for editing a contact when the close button is clicked.
 */
document
  .getElementById("closeEditOverlay")
  .addEventListener("click", function () {
    document.querySelector(".editContactOverlay").classList.add("hidden");
  });

/**
 * Closes the small overlay for editing a contact when the close button is clicked.
 */
document
  .getElementById("whiteCloseEditOverlay")
  .addEventListener("click", function () {
    document.querySelector(".editContactOverlay").classList.add("hidden");
  });

/**
 * 
 * Toggles the visibility of the popup overlay.
 * @param {Event} event - The event object.
 */
function togglePopup(event) {
  const popupOverlay = document.getElementById("popupOverlay");
  popupOverlay.classList.toggle("hidden");
  event.stopPropagation(); 
}

/**
 * 
 * Closes the popup overlay when clicking outside of it.
 * @param {Event} event - The event object.
 */
document.addEventListener("click", function(event) {
  const popupOverlay = document.getElementById("popupOverlay");
  if (!popupOverlay.contains(event.target)) {
    popupOverlay.classList.add("hidden");
  }
});

/**
 * Edits the currently selected contact from the popup overlay.
 */
function editContactFromPopup() {
  const contact = contacts[currentContact];
  editContact(contact);
  closePopup();
}

/**
 * 
 * Deletes the currently selected contact from the popup overlay.
 * @returns {Promise<void>}
 */
async function deleteContactFromPopup() {
  try {
    const contactId = contacts[currentContact].id;
    await deleteContact(contactId);
    closePopup();
    window.location.href = 'contacts.html';
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

/**
 * Closes the popup overlay.
 */
function closePopup() {
  const popupOverlay = document.getElementById("popupOverlay");
  popupOverlay.classList.add("hidden");
}
