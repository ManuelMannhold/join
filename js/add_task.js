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
  "https://contacts-c645d-default-rtdb.europe-west1.firebasedatabase.app/";
const TASK_URL =
  "https://join-78ba4-default-rtdb.europe-west1.firebasedatabase.app/";
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
 * The function `updateCheckbox` is used to update the state of a checkbox based on the value of
 * `contactChoose` array at index `i`.
 * @param {string} i - The parameter `i` in the `updateCheckbox` function is used as an index to access a
 * specific element in the `contactChoose` array and to dynamically generate the id of a checkbox
 * element based on that index.
 */
function updateCheckbox(i) {
  let idcheckbox = "checkbox-contacts" + i;
  if (contactChoose[i] == true) {
    document.getElementById(idcheckbox).setAttribute("checked", "checked");
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

/**
 * The function `addInitials` retrieves the initials of a contact's name and either adds a new selected
 * contact or updates an existing one.
 * @param {string} i - The parameter `i` in the `addInitials` function is used as an index to access elements in
 * the `contacts` array and perform operations based on that index.
 */
function addInitials(i) {
  let ini = document.getElementById("display-initials");
  const initials = getInitials(contacts[i].name);
  if (contactChoose[i] != true) {
    addNewSelectedContact(i, initials, ini);
  } else {
    forLoopAddInitials(initials, i);
  }
  ini.innerHTML = "";
  showSelectedContacts(ini, i);
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
 * The function `addNewSelectedContact` adds a new contact to a list of selected contacts in
 * JavaScript.
 * @param {string} i - The parameter `i` in the `addNewSelectedContact` function is typically used as an index
 * to access a specific element in an array or collection. It helps identify the position of the
 * selected contact within the contacts array.
 * @param {array} initials - The `initials` parameter in the `addNewSelectedContact` function is used to store
 * the initials of a selected contact.
 * @param {string} ini - The parameter `ini` in the `addNewSelectedContact` function is a reference to an HTML
 * element that is being used to display the initials of a selected contact. The function removes the
 * "d-none" class from this element to make it visible.
 */
function addNewSelectedContact(i, initials, ini) {
  ini.classList.remove("d-none");
  initial.push(initials);
  initialName.push(contacts[i].name);
  namesFromContacts.push(contacts[i].name);
  contactChoose[i] = true;
}

/**
 * The function `showSelectedContacts` displays the initials of selected contacts and a count of
 * additional contacts.
 * @param {string} ini - The `ini` parameter in the `showSelectedContacts` function seems to be a reference to
 * an HTML element where the selected contacts will be displayed. This element is used to update its
 * inner HTML content with the initials and background colors of the selected contacts based on the
 * provided data.
 */
function showSelectedContacts(ini, i) {
  let count = 0;
  for (let j = 0; j < initial.length; j++) {
    if (j < 4) {
      ini.innerHTML += displayInitials(i, initial[j]);
    } else count++;
  }
  initalsBackgroundColor(i);
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
function getInitials(name) {
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");

  return initials;
}

/**
 * The function `initalsBackgroundColor` sets the background color of an element based on a color class
 * stored in a contacts array.
 * @param {string} i - The parameter `i` in the `initalsBackgroundColor` function is used as an index to access
 * a specific element in the `contacts` array.
 */
function initalsBackgroundColor(i) {
  let ini = document.getElementById(`initials-span${i}`);

  ini.style.backgroundColor = contacts[i].colorClass;
}
//-------------End initials functions--------------//

/**
 * The function `checkContactsInList` checks if a contact is selected in a list and updates the state
 * accordingly.
 * @param {string} i - The parameter `i` in the `checkContactsInList` function is typically used as an index or
 * identifier to reference a specific contact in a list.
 * @param {object} event - The `event` parameter in the `checkContactsInList` function is typically an event
 * object that represents the event that was triggered, such as a click event. It can be used to access
 * information about the event, like the target element or any additional data associated with the
 * event.
 * @param {boolean} stopPro - The `stopPro` parameter is a boolean value that is used to determine whether the
 * event propagation should be stopped or not. If `stopPro` is `true`, then the `stopPropagation()`
 * method will be called on the event object to prevent further propagation of the current event in the
 * capturing and
 */
function checkContactsInList(i, event, stopPro) {
  let contactChecked = document.getElementById(`checkbox-contacts${i}`);
  if (contactChecked.checked == true) {
    contactChoose[i] = true;
    displayInitials();
    isChecked.push(contactChecked.checked);
  } else {
    contactChoose[i] = false;
    uncheckContactInList(contactChecked);
  }
  save();
  if (stopPro) event.stopPropagation();
}

/**
 * The function uncheckContactInList checks if a contact is unchecked in a list.
 * @param {object} contactChecked - The `contactChecked` parameter is likely an object representing a contact in
 * a list. The function `uncheckContactInList` is designed to handle the case when the contact is
 * unchecked in the list.
 */
function uncheckContactInList(contactChecked) {
  if (contactChecked.checked == false) {
  }
}
