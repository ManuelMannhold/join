let tasks = [];
let subtaskAdd = [];
let contacts = [];
let contactsNames = [];
let colorClassForContact = [];
let assigned = [];
let initial = [];
let initialName = [];
let initialColor = [];
let namesFromContacts = [];
let tasksBoardAdd = [];
let isChecked = [];
let contactChoose = [];
let tasksBd = [];
let listContactsLoaded = false;
let isClicked1 = false;
let isClicked2 = false;
let isClicked3 = false;
let openCategorie = false;
let openContacts = false;
let openEditChangeSubtasks = 0;
let currentColumn = 0;
const colorClasses = [
  "orange",
  "purple",
  "blue",
  "pink",
  "yellow",
  "green",
  "red",
];
const URL_CONTACT =
  "https://mycontacts-f669e-default-rtdb.europe-west1.firebasedatabase.app/";
const TASK_URL =
  "https://myjoin-3a457-default-rtdb.europe-west1.firebasedatabase.app/";
let resultTask = false;

/**
 * The `init` function includes HTML, fetches contacts, loads tasks, gets names from an array, gets
 * color class, loads, shows subtasks, and hovers over the sidebar.
 */
async function init() {
  includeHTML();
  await fetchContacts();
  loadTasks().then((resultTask) => {
    getNamesFromArray();
    getColorClass();
    load();
    showSubtask();
    hoverSidebar();
  });
}

/**
 * The function `loadTasks` asynchronously fetches task data from a specified URL and stores it in a
 * variable.
 */
async function loadTasks() {
  let response = await fetch(TASK_URL + ".json");
  let responseToJson = await response.json();
  if (responseToJson == null) tasksBoardAdd = [];
  else tasksBoardAdd = responseToJson;
  resultTask = true;
}

/**
 * The function fetches contacts data from a specified URL and assigns color classes to contacts if not
 * already present.
 * @param {string} path - The `path` parameter is a string that represents the path to the JSON file
 * containing contact information. It is used to fetch the contacts data from the specified URL.
 */
async function fetchContacts(path = "") {
  try {
    const response = await fetch(URL_CONTACT + path + ".json");
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
  } catch (error) {}
}

/**
 * The function `putDataTasks` sends a PUT request to a specified URL with JSON data and returns the
 * response as JSON.
 * @param {string} path - The `path` parameter is a string that represents the path to the resource where the
 * data will be updated. It is used to construct the URL for the PUT request.
 * @param {data} - The `data` parameter in the `putDataTasks` function is an object that contains the
 * information you want to update or add to the tasks. This data will be sent in the request body as a
 * JSON string when making a PUT request to the specified `path` endpoint.
 * @returns The `putDataTasks` function is returning the JSON response from the API after sending a PUT
 * request with the provided data to the specified path.
 */
async function putDataTasks(path = "", data = {}) {
  let response = await fetch(TASK_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * The function `getNamesFromArray` extracts names from an array of contacts.
 */
function getNamesFromArray() {
  contactsNames = contacts.map((contact) => contact.name);
}

/**
 * The function `ifIsListContactsLoaded` checks if the list of contacts is loaded and either shows or
 * hides the contacts based on the current state.
 * @param {object} event - The `event` parameter is typically an event object that represents an event that has
 * occurred, such as a click or keypress event. It is often passed to event handler functions in
 * JavaScript to provide information about the event that triggered the function.
 * @param {boolean} stopPro - The `stopPro` parameter is a boolean value that is used to determine whether the
 * event propagation should be stopped or not. If `stopPro` is `true`, then `event.stopPropagation()`
 * will be called to prevent the event from bubbling up the DOM tree. If `stopPro` is
 * @param {fktEdit} - The `fktEdit` parameter is a function that is passed as an argument to the
 * `ifIsListContactsLoaded` function. It is used to perform some action related to editing contacts
 * when the list of contacts is loaded.
 */
function ifIsListContactsLoaded(event, stopPro, fktEdit) {
  if (listContactsLoaded == false) {
    listContactsLoaded = true;
    showContacts(fktEdit);
    closeButtonForShowContacts();
  } else {
    listContactsLoaded = false;
  }
  if (stopPro) event.stopPropagation();
  openContacts = true;
}

/**
 * The function `showContacts` displays a list of contacts on a webpage by iterating through an array
 * of contacts and updating the HTML content accordingly.
 */
function showContacts() {
  let container = document.getElementById("show-contacts");

  container.innerHTML = "";

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i].name;

    container.classList.remove("d-none");
    container.innerHTML += displayContactsTemplate(i, contact);
    updateCheckbox(i);
    initialsBackgroundColor(i);
  }
}

/**
 * Updates the checkbox state for a contact based on its selection status.
 *
 * @param {number} i - The index of the contact in the contacts array.
 */
function updateCheckbox(i) {
  console.log(contacts);
  let idcheckbox = "checkbox-contacts" + i;
  const isAlreadySelected = contactChoose.some(
    (contact) => contact.id === contacts[i].id
  );

  if (isAlreadySelected) {
    document.getElementById(idcheckbox).setAttribute("checked", "unchecked");
  }
}

/**
 * The function `updateCheckEdit` updates the `contactChoose` array based on whether the `nameEdit`
 * matches the name in the `contacts` array.
 * @param {string} nameEdit - The `nameEdit` parameter is the name that you want to check and update in the
 * `contacts` array. The function `updateCheckEdit` iterates through the `contacts` array and sets the
 * corresponding value in the `contactChoose` array to `true` if the name matches `name
 */
function updateCheckEdit(nameEdit) {
  for (let i = 0; i < contacts.length; i++) {
    if (nameEdit == contacts[i].name) {
      contactChoose[i] = true;
    } else if (contactChoose[i] != true) contactChoose[i] = false;
  }
}

/**
 * The function cleanCheckbox clears all checkboxes for contacts on a webpage.
 */
function cleanCheckbox() {
  for (let i = 0; i < contacts.length; i++) {
    document.getElementById(`checkbox-contacts${i}`).checked = false;
  }
}

/**
 * The function `initialsBackgroundColor` sets the background color of an element based on a color
 * class stored in a contacts array.
 * @param {string} i - The parameter `i` in the `initialsBackgroundColor` function is used as an index to access
 * a specific element in the `contacts` array.
 */
function initialsBackgroundColor(i) {
  let initials = document.getElementById(`initials-bg${i}`);

  initials.style.backgroundColor = contacts[i].colorClass;
}

/**
 * The function `closeButtonForShowContacts` clears the content of an element and updates another
 * element with a template.
 */
function closeButtonForShowContacts() {
  let assigny = document.getElementById("input-assigned");

  if (assigny == onfocus) {
    assigned.innerHTML = "";
    document.getElementById("add-button-contacts").innerHTML =
      closeButtonForShowContactsTemplate();
  }
}

/**
 * The function `closeContacts` hides the contacts section, changes the button text, and sets a flag to
 * indicate that the contacts list is not loaded.
 * @param {object} event - The `event` parameter is typically an event object that represents an event that
 * occurs in the DOM, such as a click, keypress, or mouse movement. It can be used to access
 * information about the event, like the target element or the type of event that occurred.
 * @param {boolean} stopPro - The `stopPro` parameter in the `closeContacts` function is a boolean value that
 * determines whether the event propagation should be stopped or not. If `stopPro` is `true`, then
 * `event.stopPropagation()` will be called to prevent the event from bubbling up the DOM tree.`
 */
function closeContacts(event, stopPro) {
  let buttonContacts = document.getElementById("close-contacts");

  document.getElementById("show-contacts").classList.add("d-none");
  buttonContacts.innerHTML = `
             <div>
                 <span>+</span>
             </div>
         `;
  openContacts = false;
  if (stopPro) event.stopPropagation();
  document.getElementById("add-button-contacts").innerHTML = "+";
  listContactsLoaded = false;
}

//-------------Begin initials functions--------------//

function addInitials(i) {
  let ini = document.getElementById("display-initials");
  const contactIndex = contactChoose.findIndex(
    (contact) => contact.id === contacts[i].id
  );

  if (contactIndex !== -1) {
    spliceContact(contactIndex);
    showSelectedContacts();
  } else {
    contactChoose.push(contacts[i]);
    showSelectedContacts();
  }
}

/**
 * Removes a contact from the contactChoose array at the specified index.
 *
 * @param {number} i - The index of the contact to remove.
 */
function spliceContact(i) {
  contactChoose.splice(i, 1);
}

/**
 * This function iterates through an array to remove elements matching a specified initial and updates
 * another array accordingly.
 * @param {array} initials - The `initials` parameter seems to represent the initials of a person or entity. It
 * is used in the `forLoopAddInitials` function to remove entries from arrays based on matching
 * initials.
 * @param {string} i - The parameter `i` in the function `forLoopAddInitials` is used as an index to identify a
 * specific element in the `contactChoose` array.
 */
function forLoopAddInitials(initials, i) {
  for (let id = 0; id < initial.length; id++) {
    if (initial[id] == initials) {
      initial.splice(id, 1);
      initialName.splice(id, 1);
      contactChoose[i] = false;
    }
  }
}

/**
 * The function `showSelectedContacts` displays the initials of selected contacts and a count of
 * additional contacts.
 * @param {string} ini - The `ini` parameter in the `showSelectedContacts` function seems to be a reference to
 * an HTML element where the selected contacts will be displayed. This element is used to update its
 * inner HTML content with the initials and background colors of the selected contacts based on the
 * provided data.
 */
function showSelectedContacts() {
  let ini = document.getElementById("display-initials");
  ini.classList.remove("d-none");
  ini.innerHTML = "";
  let count = 0;
  for (let j = 0; j < contactChoose.length; j++) {
    if (j < 4) {
      ini.innerHTML += displayInitials(
        j,
        getInitialsfromTask(contactChoose[j].name),
        contactChoose
      );
    } else {
      count++;
    }
  }
  if (count) ini.innerHTML += displayInitialsNumber(count);
}

/**
 * The function `getInitials` takes a name as input, splits it into parts, extracts the first letter of
 * each part, and returns the initials as a single string.
 * @param {string} name - The `getInitials` function takes a `name` parameter, which is a string representing a
 * person's full name.
 * @returns The function `getInitials` takes a `name` as input, splits the name into parts separated by
 * spaces, extracts the first character of each part, and then joins these characters together to form
 * the initials of the name. Finally, the function returns the initials as a string.
 */
function getInitialsfromTask(name) {
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");

  return initials;
}

//-------------End initials functions--------------//

function checkContactsInList(i, event, stopPro) {
  let contactChecked = document.getElementById(`checkbox-contacts${i}`);

  if (contactChecked.checked) {
    if (!contactChoose.includes(contacts[i])) {
      contactChoose.push(contacts[i]);
      const initials = getInitialsfromTask(contacts[i].name);
      showSelectedContacts(i, initials);
    }
  } else {
    contactChoose = contactChoose.filter((contact) => contact !== contacts[i]);
    showSelectedContacts();
  }
  updateCheckbox(i);
  if (stopPro) event.stopPropagation();
}

/**
 * The function uncheckContactInList checks if a contact is unchecked in a list.
 * @param {object} contactChecked - The `contactChecked` parameter is likely an object representing a contact in
 * a list. The function `uncheckContactInList` is designed to handle the case when the contact is
 * unchecked in the list.
 */
function uncheckContactInList(contactChecked) {
  if (!contactChecked.checked) {
  }
}
