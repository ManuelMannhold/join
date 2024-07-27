/**
 * The function `getPrio` returns a priority value based on which of three variables (`isClicked1`,
 * `isClicked2`, `isClicked3`) is set to true.
 * @returns The `getPrio` function returns the priority value based on the conditions. If `isClicked1`
 * is true, it returns 1. If `isClicked2` is true, it returns 2. If `isClicked3` is true, it returns 3.
 * If none of the conditions are met, the function does not return anything explicitly (which means it
 * returns `undefined
 */
function getPrio() {
    if (isClicked1 == true) {
      return 1;
    }
    if (isClicked2 == true) {
      return 2;
    }
    if (isClicked3 == true) {
      return 3;
    }
  }
  
  
  /**
   * The function `hoverValueFromSubtask` adds event listeners for mouseover, mouseout, and touchstart
   * events to show images when hovering over a subtask element.
   * @param {string} i - The parameter `i` in the `hoverValueFromSubtask` function represents the index or
   * identifier of the subtask element that the function is targeting.
   */
  function hoverValueFromSubtask(i) {
    openEditChangeSubtasks = 1;
    let subtask = document.getElementById(`subtask${i}`);
    let images = document.getElementById(`images-subtask${i}`);
  
    if (subtask && images) {
      subtask.addEventListener("mouseover", function () {
        mouseOver(subtask, images);
      });
  
      subtask.addEventListener("mouseout", function () {
        mouseOut(subtask, images);
      });
  
      subtask.addEventListener('touchstart', function() {
        mouseOver(subtask, images);
      });
    }
  }
  
  /**
   * The function `mouseOver` changes the background color of a specified element and removes the
   * "d-none" class from a specified set of images when triggered by a mouseover event.
   * @param {string} subtask - The `subtask` parameter is likely referring to an HTML element that represents a
   * subtask in a task list or a similar structure. It could be a `<div>`, `<li>`, or any other HTML
   * element that contains information about a specific subtask.
   * @param {string} images - The `images` parameter is likely a reference to an HTML element that contains
   * images.
   */
  function mouseOver(subtask, images) {
    images.classList.remove("d-none");
    subtask.style.backgroundColor = "#FFFFFF";
  }
  
  /**
   * The function `mouseOut` hides images and sets the background color of a specified element to
   * transparent when the mouse moves out of it.
   * @param {string} subtask - The `subtask` parameter is likely referring to an HTML element that represents a
   * subtask in a task list or a similar structure. It is used in the `mouseOut` function to change the
   * background color of the `subtask` element to transparent when the mouse moves out of it.
   * @param {string} images - The `images` parameter is likely a reference to an HTML element that contains
   * images.
   */
  function mouseOut(subtask, images) {
    images.classList.add("d-none");
    subtask.style.backgroundColor = "rgba(0,0,0,0)";
  }
  
  /**
   * The function `deleteTask` removes a task from an array, updates the display, and saves the changes.
   * @param {string} i - The parameter `i` in the `deleteTask` function represents the index of the task that you
   * want to delete from the `tasks` array.
   */
  function deleteTask(i) {
    tasks.splice(i, 1);
    showSubtask();
    save();
  }
  
  /**
   * The function `editSubtask` is used to edit a specific subtask element in a web page by replacing its
   * content with an editable template.
   * @param {string} i - The parameter `i` in the `editSubtask` function is used to identify which subtask element
   * to edit. It is likely an index or identifier for the specific subtask element that needs to be
   * updated.
   */
  function editSubtask(i) {
    let subtask = document.getElementById(`subtask${i}`);
  
    subtask.innerHTML = editSubtaskTemplate(i);
  
    save();
  }
  
  /**
   * The function `updateSubtask` updates a subtask in an array, then displays the updated subtasks and
   * saves the changes.
   * @param {string} i - The parameter `i` in the `updateSubtask` function is used as an index to identify which
   * subtask is being updated.
   */
  function updateSubtask(i) {
    let input = document.getElementById(`update-subtask-input${i}`).value;
  
    tasks[i] = input;
  
    showSubtask();
    save();
  }
  
  /**
   * The function `changePrioButtonUrgent` changes the background images of priority buttons to indicate
   * that the urgent button is active.
   */
  function changePrioButtonUrgent() {
    document.getElementById("input-prio1").style.backgroundImage =
      "url(../assets/img/urgent_button_active.svg)";
    document.getElementById("input-prio2").style.backgroundImage =
      "url(../assets/img/medium_button.svg)";
    document.getElementById("input-prio3").style.backgroundImage =
      "url(../assets/img/low_button.svg)";
    isClicked1 = true;
    isClicked2 = false;
    isClicked3 = false;
  }
  
  /**
   * The function `changePrioButtonMedium` changes the background images of priority buttons to indicate
   * medium priority and updates boolean variables accordingly.
   */
  function changePrioButtonMedium() {
    document.getElementById("input-prio2").style.backgroundImage =
      "url(../assets/img/medium_button_active.svg)";
    document.getElementById("input-prio1").style.backgroundImage =
      "url(../assets/img/urgent_button.svg)";
    document.getElementById("input-prio3").style.backgroundImage =
      "url(../assets/img/low_button.svg)";
    isClicked1 = false;
    isClicked2 = true;
    isClicked3 = false;
  }
  
  /**
   * The function `changePrioButtonLow` changes the background images of three input elements to visually
   * represent a low priority level.
   */
  function changePrioButtonLow() {
    document.getElementById("input-prio3").style.backgroundImage =
      "url(../assets/img/low_button_active.svg)";
    document.getElementById("input-prio1").style.backgroundImage =
      "url(../assets/img/urgent_button.svg)";
    document.getElementById("input-prio2").style.backgroundImage =
      "url(../assets/img/medium_button.svg)";
    isClicked1 = false;
    isClicked2 = false;
    isClicked3 = true;
  }
  
  /**
   * The `save` function converts the `tasks` array to a JSON string and stores it in the browser's
   * localStorage with the key "tasks".
   */
  function save() {
    let tasksAsText = JSON.stringify(tasks);
    localStorage.setItem("tasks", tasksAsText);
  }
  
  /**
   * The function `load` retrieves tasks stored in the local storage and parses them from JSON format.
   */
  function load() {
    let tasksAsText = localStorage.getItem("tasks");
    if (tasksAsText) {
      task = JSON.parse(tasksAsText);
    }
  }
  
  /* The JavaScript code adds a click event listener to the window. When a click event occurs, it
  checks if the variable `openCategorie` is true. If it is true, it sets `openCategorie` to false,
  calls the `closeCategorie()` function, and then calls the `closeButtonForShowContacts()` function.
  It then checks if the variable `openContacts` is true. If it is true, it sets `openContacts` to
  false and calls the `closeContacts()` function. 
  */
  window.addEventListener("click", function (event) {
    if (openCategorie) {
      openCategorie = false;
      closeCategorie();
      closeButtonForShowContacts();
    }
    if (openContacts) {
      openContacts = false;
      closeContacts();
    }
  });
  
  /**
   * This function add the initials from the initials array and select the `toggleChecked` function
   * @param {string} i - The parameter in the `checkContacts` function represents the index of current checkbox
   */
  function checkContacts(i) {
    let checkbox = document.getElementById(`checkbox-contacts${i}`);
    addInitials(i);
    toggleChecked(checkbox);
  }
  
  /**
   * This function toggle the hook from false to true, or from true to false
   * @param {string} checkbox - This string is the id from the current checkbox
   */
  function toggleChecked(checkbox) {
    checkbox.checked = !checkbox.checked;
  }
  
  /**
   * This function open a new input to edit the task by doubleclick
   * @param {string} i - The parameter `i` in the `doubleclickSubtaskToEdit` function represents the index of the task that you
   * want to edit from the `tasks` array.
   *  @param {object} event - The `event` parameter is typically an event object that represents an event that
   * occurs in the DOM, such as a click, keypress, or mouse movement. It can be used to access
   * information about the event, such as the target element or the type of event that occurred.
   * @param {boolean} stopPro - The `stopPro` parameter is a boolean variable that is used to determine whether the
   * event propagation should be stopped or not. If `stopPro` is `true`, then the
   * `event.stopPropagation()` method will be called to prevent the event from bubbling up the DOM tree.
   */
  
  function doubleclickSubtaskToEdit(i) {
    let sub = document.getElementById(`subtask${i}`);
  
    sub.addEventListener("dblclick", function () {
      editSubtask(i);
    });
  }
  