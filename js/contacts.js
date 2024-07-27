const contactsURL =
  "https://contacts-c645d-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];

const colorClasses = [
  "orange",
  "purple",
  "blue",
  "pink",
  "yellow",
  "green",
  "red",
];
let currentContact = 0;

/**
 * Initializes the page by including HTML, fetching contacts, assigning colors, and displaying them.
 */
async function initializePage() {
  includeHTML();
  await fetchContacts();
  await assignColorsToContacts(contacts);
  showContacts();
  setBg();
  hoverSidebar();
}

/**
 * 
 * Assigns random colors to contacts.
 * @param {Array} contacts - The array of contact objects.
 */
async function assignColorsToContacts(contacts) {
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const colorClass = colorClasses[i % colorClasses.length];
    contact.colorClass = colorClass;

    await putData(contact.id, contact);
  }
}

/**
 * Sets the background color of contact initials based on the assigned color class.
 */
function setBg() {
  const elements = document.querySelectorAll(
    ".contactInitials, .contactDetailsInitials, .overlayInitialsContainer"
  );

  elements.forEach((element) => {
    const initials = element.textContent.trim();
    const contact = contacts.find((c) => getInitials(c.name) === initials);
    if (contact && contact.colorClass) {
      element.classList.add(contact.colorClass);
    }
  });
}

/**
 * 
 * Fetches contacts from the server.
 * @param {string} [path=""] - The path for the contacts URL.
 */
async function fetchContacts(path = "") {
  try {
    const response = await fetch(contactsURL + path + ".json");
    const data = await response.json();
    contacts = data
      ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
      : [];
    contacts.forEach((contact) => {
      if (!contact.colorClass) {
        contact.colorClass =
          colorClasses[contacts.indexOf(contact) % colorClasses.length];
      }
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Kontakte:", error);
  }
}

/**
 * 
 * Sends a POST request to add data to the server.
 * @param {string} [path=""] - The path for the contacts URL.
 * @param {Object} [data=""] - The data to be sent.
 * @returns {Promise<Object>} - The response data in JSON format.
 */
async function postData(path = "", data = "") {
  let response = await fetch(contactsURL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * 
 * Sends a DELETE request to delete data from the server.
 * @param {string} [path=""] - The path for the contacts URL.
 * @returns {Promise<Object>} - The response data in JSON format.
 */
async function deleteData(path = "") {
  let response = await fetch(contactsURL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

/**
 * 
 * Sends a PUT request to update data on the server.
 * @param {string} [path=""] - The path for the contacts URL.
 * @param {Object} [data={}] - The data to be updated.
 * @returns {Promise<Object>} - The response data in JSON format.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(contactsURL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * 
 * Retrieves the initials from a given name.
 * @param {string} name - The full name of the contact.
 * @returns {string} - The initials of the contact.
 */
function getInitials(name) {
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");
  return initials;
}

/**
 * 
 * Generates the HTML for the contacts sidebar.
 * @param {Array} contacts - The array of contact objects.
 * @returns {string} - The generated HTML string.
 */
function contactsSidebar(contacts) {
  let { html, addedLetters } = initializeHtmlAndLetters();

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    processFirstLetter(contact, addedLetters, html);
    addContactToHtml(contact, html);
  }

  return html.value;
}

/**
 * 
 * Initializes the HTML string and the Set for added letters.
 * @returns {Object} - The initialized HTML string and Set of added letters.
 */
function initializeHtmlAndLetters() {
  let html = { value: "" };
  let addedLetters = new Set();
  return { html, addedLetters };
}

/**
 * 
 * Processes the first letter of the contact name for the sidebar.
 * @param {Object} contact - The contact object.
 * @param {Set} addedLetters - The Set of added letters.
 * @param {Object} html - The HTML string object.
 */
function processFirstLetter(contact, addedLetters, html) {
  const firstLetter = contact.name.charAt(0).toUpperCase();
  if (!addedLetters.has(firstLetter)) {
    html.value += `
      <div class="letter">${firstLetter}</div>
      <div class="lineContactSidebar"></div>
    `;
    addedLetters.add(firstLetter);
  }
}

/**
 * 
 * Adds the contact details to the HTML string.
 * @param {Object} contact - The contact object.
 * @param {Object} html - The HTML string object.
 */
function addContactToHtml(contact, html) {
  html.value += `
    <div class="contactListInner">
        <div class="contactInitials">${getInitials(contact.name)}</div>
        <div>
            <div class="contactName">${contact.name}</div>
            <div class="contactEmail">${contact.email}</div>
        </div>
    </div>
  `;
}

/**
 * 
 * Retrieves the initials from a given name.
 * @param {string} name - The full name of the contact.
 * @returns {string} - The initials of the contact.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

/**
 * Displays the contacts on the page.
 */
async function showContacts() {
  const contactListDiv = initializeContactListDiv();

  if (contacts.length > 0) {
    sortContacts(contacts);
    displayContacts(contactListDiv, contacts);
    addContactClickListeners();
  } else {
    displayNoContactsMessage(contactListDiv);
  }
}

/**
 * 
 * Initializes and clears the contact list div.
 * @returns {HTMLElement} - The contact list div element.
 */
function initializeContactListDiv() {
  const contactListDiv = document.getElementById("contactList");
  contactListDiv.innerHTML = "";
  return contactListDiv;
}

/**
 * 
 * Sorts the contacts by name.
 * @param {Array} contacts - The array of contact objects.
 */
function sortContacts(contacts) {
  contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 
 * Displays the contacts in the contact list div.
 * @param {HTMLElement} contactListDiv - The contact list div element.
 * @param {Array} contacts - The array of contact objects.
 */
function displayContacts(contactListDiv, contacts) {
  const contactsHTML = contactsSidebar(contacts);
  contactListDiv.innerHTML = contactsHTML;
}

/**
 * Adds click listeners to the contact elements.
 */
function addContactClickListeners() {
  const contactDivs = document.querySelectorAll(".contactListInner");
  contactDivs.forEach((contactDiv, index) => {
    contactDiv.addEventListener("click", () => {
      showContactDetails(index);
      currentContact = index;
    });
  });
}

/**
 * 
 * Displays a message when no contacts are available.
 * @param {HTMLElement} contactListDiv - The contact list div element.
 */
function displayNoContactsMessage(contactListDiv) {
  contactListDiv.innerHTML = "Keine Kontakte vorhanden.";
}

contacts.sort();

/**
 * Adjusts the layout based on the screen width.
 */
function adjustLayoutForScreenWidth() {
  if (window.innerWidth <= 768) {
    hideContactsSidebar();
    showHeadlinesContainer();
    showContactsArrow();
  } else {
    resetLayoutForLargerScreens();
  }
}

/**
 * Hides the contacts sidebar element.
 */
function hideContactsSidebar() {
  const contactsSidebar = document.querySelector(".contactsSidebar");
  contactsSidebar.style.display = "none";
}

/**
 * Displays the headlines container element.
 */
function showHeadlinesContainer() {
  const headlinesContainer = document.querySelector(".headlinesContainer");
  headlinesContainer.style.display = "block";
}

/**
 * Displays the contacts arrow element and adds a click event to navigate to the contacts page.
 */
function showContactsArrow() {
  const contactsArrow = document.querySelector(".contactsArrow");
  contactsArrow.style.display = "block";
  contactsArrow.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link click
    window.location.href = "../html/contacts.html"; // Go to the Contacts page
  });
}

/**
 * Resets the layout for larger screens by displaying the contacts sidebar and hiding the contacts arrow.
 */
function resetLayoutForLargerScreens() {
  const contactsSidebar = document.querySelector(".contactsSidebar");
  contactsSidebar.style.display = "block";

  const contactsArrow = document.querySelector(".contactsArrow");
  contactsArrow.style.display = "none";
}

/**
 * 
 * Updates the UI for the contact details.
 * @param {number} index - The index of the current contact.
 */
function updateContactDetailsUI(index) {
  document.getElementById("contactsFullscreen").classList.remove("out");
  document.getElementById("contactsFullscreen").classList.add("in");

  let contactDivs = document.querySelectorAll(".contactListInner");
  contactDivs.forEach((contactDiv, i) => {
    if (i === index) {
      contactDiv.classList.add("active");
      contactDiv.classList.add("nohover");
      contactDiv.querySelector(".contactName").style.color = "#ffffff";
    } else {
      contactDiv.classList.remove("active");
      contactDiv.classList.remove("nohover");
      contactDiv.querySelector(".contactName").style.color = "#000000";
    }
  });
}

/**
 * 
 * Displays the contact details.
 * @param {number} index - The index of the contact to display.
 */
function showContactDetails(index) {
  let contact = 0;
  if (index == null) {
    contact = contacts[currentContact];
  } else {
    contact = contacts[index];
  }
  createContactDetailsHTML(contact);
  adjustLayoutForScreenWidth();
  updateContactDetailsUI(index);
  const editButton = document.querySelector(".editContactButton");
  editButton.onclick = function () {
    editContact(contact);
  };
  showDotIcon();
}

/**
 * Displays the dot icon based on the screen width.
 */
function showDotIcon() {
  if (window.innerWidth <= 768) {
    const dotIcon = document.getElementById("dotIcon");
    dotIcon.style.display = "flex";
  }
}

/**
 * Hides the dot icon.
 */
function hideDotIcon() {
  const dotIcon = document.getElementById("dotIcon");
  dotIcon.style.display = "none";
}

/**
 * Event listener to control the visibility of the dot icon.
 */
document.addEventListener("DOMContentLoaded", function () {
  const contactsFullscreen = document.getElementById("contactsFullscreen");

  // Check if contactsFullscreen is visible when the page loads
  if (contactsFullscreen.classList.contains("in")) {
    showDotIcon();
  } else {
    hideDotIcon();
  }

  // Event listener for changes in the contactsFullscreen class
  contactsFullscreen.addEventListener("transitionend", function () {
    if (contactsFullscreen.classList.contains("in")) {
      showDotIcon();
    } else {
      hideDotIcon();
    }
  });
});
