/**
 * The clearInputs function resets various input fields and elements on a web page to their default
 * values.
 */
function clearInputs() {
  document.getElementById("input-title").value = "";
  document.getElementById("input-description").value = "";
  document.getElementById("input-date").valueAsDate = null;
  document.getElementById("input-subtask").value = "";
  document.getElementById("show-subtask").innerHTML = "";
  spliceTask();
  document.getElementById("input-category").value = "";
  document.getElementById("display-initials").innerHTML = "";
  document.getElementById("input-prio1").style.backgroundImage =
    "url(../assets/img/urgent_button.svg)";
  document.getElementById("input-prio2").style.backgroundImage =
    "url(../assets/img/medium_button_active.svg)";
  document.getElementById("input-prio3").style.backgroundImage =
    "url(../assets/img/low_button.svg)";

  save();
}

/**
 * The function `imageOnSubtask` sets a background image for an input element when it is focused.
 */
function imageOnSubtask() {
  let subtask = document.getElementById("input-subtask");

  if (subtask.onfocus) {
    subtask.style.backgroundImage = "url(../assets/img/add.svg)";
    subtask.style.backgroundPosition = "center";
  }
}

/**
 * The function `showCategorie` displays a category and toggles visibility of certain elements based on
 * the event and stopPro parameter.
 * @param {object} event - The `event` parameter is an event object that represents the event that occurred,
 * such as a click or keypress event. It is typically passed to event handler functions in JavaScript
 * to provide information about the event that triggered the function.
 * @param {boolean} stopPro - The `stopPro` parameter in the `showCategorie` function is a boolean variable that
 * is used to determine whether the event propagation should be stopped or not. If `stopPro` is `true`,
 * then the `event.stopPropagation()` method will be called to stop the event from bubbling up
 */
function showCategorie(event, stopPro) {
  let display = document.getElementById("display-categorie");
  document.getElementById("input-categorie-image-down").classList.add("d-none");
  document
    .getElementById("input-categorie-image-up")
    .classList.remove("d-none");
  display.classList.remove("d-none");
  openCategorie = true;
  display.innerHTML = "";
  display.innerHTML = showCategorieTemplate();
  if (stopPro == true) event.stopPropagation();
}

/**
 * The function `addToInputTechnical` sets the value of an input field with the id "input-category" to
 * "Technical Task" and then closes the category.
 */
function addToInputTechnical() {
  let value = document.getElementById("input-category");
  value.value = "Technical Task";
  closeCategorie();
}

/**
 * The function `addToInputUser` sets the value of an input element with the id "input-category" to
 * "User Story" and then closes the category.
 */
function addToInputUser() {
  let value = document.getElementById("input-category");
  value.value = "User Story"; // setze den Textinhalt anstelle des Elements
  closeCategorie();
}

/**
 * The function closeCategorie hides certain elements and stops event propagation if specified.
 * @param {object} event - The `event` parameter is typically an event object that represents an event that
 * occurs in the DOM, such as a click, keypress, or mouse movement. It can be used to access
 * information about the event, such as the target element or the type of event that occurred.
 * @param {boolean} stopPro - The `stopPro` parameter is a boolean variable that is used to determine whether the
 * event propagation should be stopped or not. If `stopPro` is `true`, then the
 * `event.stopPropagation()` method will be called to prevent the event from bubbling up the DOM tree.
 */
function closeCategorie(event, stopPro) {
  let display = document.getElementById("display-categorie");
  let down = document.getElementById("input-categorie-image-down");
  let up = document.getElementById("input-categorie-image-up");

  up.classList.add("d-none");
  display.classList.add("d-none");
  down.classList.remove("d-none");

  if (stopPro == true) event.stopPropagation();
  openCategorie = false;
}

/**
 * The function `showSubtask` dynamically populates a specified HTML element with subtasks based on the
 * `tasks` array.
 */
function showSubtask() {
  let inputs = document.getElementById("show-subtask");
  inputs.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    let showtasks = tasks[i];
    inputs.innerHTML += showSubtaskTemplate(i, showtasks);
  }
}

/**
 * The function `addSubTask` adds a new subtask to a list of tasks if the input is not empty.
 */
function addSubTask() {
  let input = document.getElementById("input-subtask");
  checkRequieredValues(
    input,
    document.getElementById("error-message-subtasks")
  );
  if (input.value.trim() != "") {
    tasks.push(input.value);
    showSubtask();
  }
  input.value = "";
  save();
}

/**
 * The function `shortURL` takes a full URL as input and returns only the last part of the URL after
 * the last "/" character.
 * @param {string} url - The `shortURL` function takes a URL as input and returns the last part of the URL after
 * the last occurrence of the "/" character.
 * @returns The function `shortURL` takes a full URL as input and returns only the last part of the URL
 * after the last "/" character.
 */
function shortURL(url) {
  return url.substring(url.lastIndexOf("/") + 1);
}

/* The code is a JavaScript function `addTask()` that is triggered when a user tries to add a
task. It retrieves the input values for title, date, and category from the respective input fields
on the webpage. It then calls the `checkRequieredValues()` function to validate if these fields are
filled out and displays error messages if they are empty. */
function addTask() {
  let title = document.getElementById("input-title");
  let date = document.getElementById("input-date");
  let category = document.getElementById("input-category");
  checkRequieredValues(title, document.getElementById("error-message-title"));
  checkRequieredValues(date, document.getElementById("error-message-date"));
  checkRequieredValues(
    category,
    document.getElementById("error-message-category")
  );
  if (title.value != "" && date.valueAsDate != null && category.value != "") {
    createTask();
    document.getElementById("add_task").classList.remove("d-none");
    setTiemoutAddTask();
    save();
  }

  /**
   * The function `setTiemoutAddTask` uses `setTimeout` to redirect to "board.html" after 2 seconds if
   * the referrer is not "board.html" and performs additional actions based on the current URL.
   */
  function setTiemoutAddTask() {
    setTimeout(function () {
      if (shortURL(document.referrer) != "board.html")
        window.location.href = "../html/board.html";
      else {
        document.getElementById("add_task").classList.add("d-none");
        if ((window.location.href = "../html/board.html")) {
          closeAddTaskBoard();
        } else {
          renderTasks();
        }
      }
    }, 2000);
  }
}

/**
 * The function `addOrEditTask` checks if the `useEditFunction` flag is set and then either calls
 * `addTaskEdit` or `addTask` accordingly.
 */
function addOrEditTask() {
  contactChoose = [];
  if (useEditFunction) addTaskEdit();
  else addTask();
}

/**
 * The function `checkRequieredValues` checks if a value is present in a given data object and updates
 * the styling and display of an error element accordingly.
 * @param {object} data - The `data` parameter seems to be an object that contains a `value` property and a
 * `classList` property. The `classList` property likely refers to a list of classes associated with an
 * HTML element.
 * @param {string} error - The `error` parameter in the `checkRequieredValues` function seems to be a reference
 * to an HTML element that is used to display an error message. The function toggles the display of
 * this element based on whether a required value is present in the `data` object. If the required
 */
function checkRequieredValues(data, error) {
  if (!data.value) {
    data.classList.add("error");
    error.style.display = "inline";
  } else {
    data.classList.remove("error");
    error.style.display = "none";
  }
}

/**
 * The function `getColorClass` iterates through an array of contacts to extract and store the
 * colorClass property of each contact.
 */
function getColorClass() {
  for (let i = 0; i < contacts.length; i++) {
    const colorClass = contacts[i].colorClass;

    colorClassForContact.push(colorClass);
  }
}


/**
 * The function `createTask` asynchronously creates a task, adds it to two arrays, updates data in a
 * specific path, clears inputs, splices the task, and saves the changes.
 */
async function createTask() {
  let task = buildTask();

  tasksBoardAdd.push(task);
  tasksBd.push(task);

  putDataTasks((path = ""), tasksBoardAdd);
  clearInputs();
  spliceTask();
  save();
}

/**
 * The `buildTask` function constructs a task object with various details including title, description,
 * assigned user, date, category, subtasks, priority, assigned contacts, and task application.
 * @returns The `buildTask` function is returning an object with the following properties:
 * - `title`: the title of the task
 * - `description`: the description of the task
 * - `assigned`: the person assigned to the task
 * - `date`: the date of the task
 * - `category`: the category of the task
 * - `subtasks`: an array of subtasks
 * - `prio: prio of the task
 * - "assigned to": getSumContacts() function
 * - taskApplication: currentColumn, is creating an object with three properties:
 */
function buildTask() {
  let { title, description, assigned, date, category, color, prio } = getTaskDetails();

  return {
    title: title,
    description: description,
    assigned: assigned,
    date: date,
    category: category,
    color: color,
    subtasks: getSubtasks(),
    prio: prio,
    "assigned to": getSumContacts(),
    taskApplication: currentColumn,
  };
}

/**
 * The function `getTaskDetails` retrieves task details such as title, description, assigned contacts,
 * date, category, and priority.
 * @returns The function `getTaskDetails` is returning an object with the following properties:
 * - `title`: the value of the input with the id "input-title"
 * - `description`: the value of the input with the id "input-description"
 * - `assigned`: the element with the id "show-contacts"
 * - `date`: the value of the input with the id "input-date" converted to
 * - `category`: the value of the input with the id "input-category"
 * - `prio`: call the function getPrio()
 * - `@return { title, description, assigned, date, category, prio };` in the `getTaskDetails`
  function is creating and returning an object with properties based on the variables `title`,
  `description`, `assigned`, `date`, `category`, and `prio`. This object serves as a structured way
  to store and access the task details retrieved from various elements in the HTML document. 
  */
function getTaskDetails() {
  let title = document.getElementById("input-title").value;
  let description = document.getElementById("input-description").value;
  let assigned = document.getElementById("show-contacts");
  let date = document.getElementById("input-date").valueAsDate;
  date.valueAsDate = formDate(date);
  let category = document.getElementById("input-category");
  let prio = getPrio();


  return { title, description, assigned, date, category, prio };
}

/**
 * The function `getSumContacts` maps names and colors from contacts into an array of objects.
 * @returns An array of objects with properties "name" and "color" mapped from the arrays
 * "namesFromContacts" and "colorClassForContact" respectively.
 */
function getSumContacts() {
  let name = namesFromContacts;
  let color = colorClassForContact;
  return name.map((n, i) => ({ name: n, color: color[i] }));
}

/**
 * The function `getSubtasks` returns an array of objects with text and checked properties based on the
 * tasks array.
 * @returns An array of objects is being returned, where each object contains a `text` property with
 * the value of each task from the `tasks` array, and a `checked` property with the value of "0".
 */
function getSubtasks() {
  return tasks.map((t) => ({ text: t, checked: "0" }));
}

/**
 * The function `getColor` takes a name as input and returns the colorClass associated with that name
 * from the contacts array.
 * @param {string} name - The `name` parameter is the name of a contact for which you want to retrieve the color
 * class. The function `getColor` iterates through the `contacts` array to find the contact with the
 * matching name and returns the color class associated with that contact.
 * @returns The function `getColor` is returning the `colorClass` associated with the contact whose
 * name matches the input `name`.
 */
function getColor(name) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].name == name) return contacts[i].colorClass;
  }
}

/**
 * The function `getColorClass` iterates through an array of contacts to extract and store the
 * colorClass property of each contact.
 */
function getColorClass() {
  for (let i = 0; i < contacts.length; i++) {
    const colorClass = contacts[i].colorClass;

    colorClassForContact.push(colorClass);
  }
}

/**
 * The function `getTaskApplication` returns the task application value from the `tasksBd` array based
 * on the `openTask` index.
 * @returns The function `getTaskApplication` is returning the task application of the currently open
 * task if it is not null. If the task application is null, it returns 0.
 */
function getTaskApplication() {
  if (tasksBd[openTask].taskApplication != null)
    return tasksBd[openTask].taskApplication;
  else return 0;
}

/**
 * The function `formDate` takes an ISO date string, converts it to a Date object, and returns a
 * formatted date string in the format "DD/MM/YYYY".
 * @param {string} dateTask - A string representing a date in ISO format, such as "2022-12-31T23:59:59.999Z".
 * @returns The function `formDate` takes a date string in ISO format as input, converts it to a Date
 * object, and then formats the date in the format "DD/MM/YYYY". The function returns the formatted
 * date string.
 */
function formDate(dateTask) {
  const isoDate = dateTask;
  const date = new Date(isoDate);

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Monate sind 0-basiert
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * The `spliceTask` function clears all elements from the `tasks` array and returns an empty array.
 * @returns The function `spliceTask()` is returning an empty array `tasks` after removing all elements
 * from it using the `splice()` method.
 */
function spliceTask() {
  tasks.splice(0, tasks.length);
  return tasks;
}

