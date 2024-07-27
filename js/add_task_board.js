/**
 * This function is async and load the data from the arrays to display it on board
 * @param {string} indexColumn 
 */
async function initBoard(indexColumn) {
  await fetchContacts();
  loadTasks().then((resultTask) => {
    getNamesFromArray();
    getColorClass();
    load();
    showSubtask();
    clearInputs();
    displayAddTask();
    renderTasks();
    if(indexColumn != null)
      currentColumn = indexColumn;
    else
      currentColumn = 0;
  });}

  /**
   * This function displays the addTask
   */

function displayAddTask() {
  document.getElementById("container-add-task-board").classList.remove("d-none");
  document.getElementById("idEditCard").classList.remove("d-none");
}

/**
 * This function close the addTask overlay in the board
 */
function closeAddTaskBoard() {
  useEditFunction = 0;
  contactChoose = [];
  document.getElementById("container-add-task-board").classList.add("d-none");
  document.getElementById("idEditCard").classList.add("d-none");
}

/**
 * This function get names from array and push into contact 
 */
function getNamesFromArray() {
  contactsNames = contacts.map((contact) => contact.name);
}

/**
 * This function clear all inputs by click at the button 
 */
function clearInputsEdit() {
  document.getElementById("input-title").value = "";
  document.getElementById("input-category").value = "";
  document.getElementById("input-date").value = "";
  document.getElementById("input-subtask").value = "";
  document.getElementById("show-subtask").innerHTML = "";
  document.getElementById("input-category").value = "";
  document.getElementById("display-initials").innerHTML = "";
  document.getElementById("input-prio1").style.backgroundImage = "url(../assets/img/urgent_button.svg)";
  document.getElementById("input-prio2").style.backgroundImage = "url(../assets/img/medium_button.svg)";
  document.getElementById("input-prio3").style.backgroundImage = "url(../assets/img/low_button.svg)";
  save();
}

/**
 * This function make happen that user can edit the inputs
 */
function addTaskEdit(){
  let title = document.getElementById("input-title");
  let date = document.getElementById("input-date");
  let category = document.getElementById("input-category");
  checkRequieredValues(title, document.getElementById("error-message-title"));
  checkRequieredValues(date, document.getElementById("error-message-date"));
  checkRequieredValues(category,document.getElementById("error-message-category")
  );

  if (title.value != "" && date.valueAsDate != null && category.value != "") 
    editTaskToBoard()

  clearInputsEdit();
  save();
}

/**
 * open functions for edit task on board
 */
function editTaskToBoard(){
  editTask();
  renderTasks();
  document.getElementById("idDetailCard").innerHTML = detailCardHTML(openTask);
  closeAddTaskBoard();
  tasks = [];
}

/**
 * This function create an array with name and backgroundcolor for each contact
 * @returns 
 */
function getContactInputs(){
  let sumContacts = [];
  for (let i = 0; i < initialName.length; i++) {
    sumContacts[i] = {
      name: initialName[i],
      color: getColor(initialName[i]),
    };
  }
  return sumContacts;
}

/**
 * This function create an array with all subtasks who was added from the addTask
 * @returns 
 */
function getSubtasksInput(){
  let subtasks = [];
  for (let j = 0; j < tasks.length; j++) {
    subtasks[j] = {
      text: tasks[j],
      checked: "0",
    };
  }
  return subtasks;
}

/**
 * This function create variables to push the data to firebase
 * @param {string} title 
 * @param {string} description 
 * @param {string} assigned 
 * @param {number} date 
 * @param {string} category 
 * @param {string} color 
 * @param {string} prio 
 * @returns 
 */
function setTask(title, description, assigned, date, category, color, prio){
  let task = {
    title: title.value,
    description: description.value,
    assigned: assigned.value,
    date: date.valueAsDate,
    category: category.value,
    subtasks: [{text: "", checked: 0,},],
    prio: prio,
    color, color,
    "assigned to": {name: "", color: "",},
    taskApplication: getTaskApplication(),};
  task["assigned to"] = getContactInputs();
  task["subtasks"] = getSubtasksInput();
  return task;
}

/**
 * This function create variables for the edit function 
 * @param {string} i 
 */
async function editTask(i) {
  let title = document.getElementById("input-title");
  let description = document.getElementById("input-description");
  let assigned = document.getElementById("show-contacts");
  let date = document.getElementById("input-date").valueAsDate;
  date.valueAsDate = formDate(date);
  let category = document.getElementById("input-category");
  let color = colorClassForContact;
  let prio = getPrio();
  let task = setTask(title, description, assigned, date, category, color, prio);
  tasksBd[openTask] = task;
  putDataTasks((path = ""), tasksBd);
  save();
}
