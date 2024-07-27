const BASE_URL ="https://join-78ba4-default-rtdb.europe-west1.firebasedatabase.app/";
let currentTask = 0;
let openTask = 0;
let useEditFunction = 0;

let result = false;
/**
Die Funktion initialisiert die board.html. 
*/ 
function boardInit() {
  initHTML();
  loadTasksBoard().then((result) => {
    renderTasks();
    fetchContacts();
  });
  fetchContacts();
}

/**
In dieser Funktion werden die Tasks aus der Firebase geladen
*/
async function loadTasksBoard() {
  let response = await fetch(BASE_URL + ".json");
  let responseToJSON = await response.json();
  tasksBd = responseToJSON;
  result = true;
  return responseToJSON;
}

/**
In dieser Funktion werden die Tasks aus der Firebase mittels der Post-Funktion geladen
*/
async function postData(path = "", data = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJSON = await response.json());
}

/**
Diese Funktion löscht Daten aus der Firebase
*/
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJSON = await response.json());
}

/**
Diese Funktion lädt Daten in die Firebase
*/
async function putDataBoard(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
Diese Funktion rendert die Tasks auf der board.html Seite
*/
function renderTasks() {
  setBackColumns();
  showTasks();
}

/**
Diese Funktion zeigt das AddTask Popup an
*/
function displayAddTask() {
  document
    .getElementById("container-add-task-board")
    .classList.remove("d-none");
}

/**
Diese Funktion löscht die Spalten in denen später die Tasks angezeigt werden sollen
*/
function setBackColumns() {
  document.getElementById("toDO").innerHTML = ``;
  document.getElementById("inProgress").innerHTML = ``;
  document.getElementById("awaitFeedback").innerHTML = ``;
  document.getElementById("done").innerHTML = ``;
}

/**
Diese Funktion öffnet die detaillierte Ansicht eines Tasks
@param {string} idTask - Ist der Index des zu öffnenen Tasks
*/
function openDetailCard(event, idTask, stopPro) {
  document.body.classList.add("overflow-hidden");
  initial = [];
  initialName = [];
  addTaskInitials(idTask);
  document.body.classList.add("overflow-hidden");
  document.getElementById("idDetailCard").classList.remove("d-none");
  document.getElementById("idDetailCard").innerHTML = detailCardHTML(idTask);
  document.getElementById("idDetailCard").classList.add("leftPart");
  document.getElementById("idDetailCard").classList.remove("leftPartOut");
  checkSubtasks(idTask);
  openTask = idTask;
  if (stopPro) 
    event.stopPropagation();
}

/**
Diese Funktion zeigt in der Edit-Funktion die schon ausgewählten Contacte aus
@param {string} idTask - Ist der Index des zu bearbeitenen Tasks
*/
function addTaskInitials(idTask){
  if(!tasksBd[idTask]["assigned to"])
    return;
  for(let i = 0; i < tasksBd[idTask]["assigned to"].length; i++)
  {
    initial.push(getInitials(tasksBd[idTask]["assigned to"][i].name));
    initialName.push(tasksBd[idTask]["assigned to"][i].name);
  }
}

/**
Diese Funktion schließt die detaillierte Ansicht eines Tasks
@param {string} idTask - Ist der Index des zu schließenen Tasks
*/
function closeDetailCard(idTask) {
  document.body.classList.remove("overflow-hidden");
  document.getElementById("idDetailCard").classList.remove("leftPart");
  document.getElementById("idDetailCard").classList.add("leftPartOut");
  document.getElementById("idDetailCard").classList.add("d-none");
}

/**
Diese Funktion zeigt in der Edit-Funktion die schon eingefügten Subtasks an
@param {string} idTask - Ist der Index des zu bearbeitenen Tasks
*/
function checkSubtasks(idTask) {
  if (tasksBd[idTask]["subtasks"] == null) return "";
  for (let i = 0; i < tasksBd[idTask]["subtasks"].length; i++) {
    let name = "checkCard" + idTask + i;
    if (tasksBd[idTask]["subtasks"][i].checked == '1')
      document.getElementById(name).setAttribute("checked", "checked");
  }
}

/**
Diese Funktion ruft die notwendigen Funktionen aus, um die Detailcard anzuzeigen
@param {string} idTask - Ist der Index des zu öffnenden Tasks
*/
function detailCardHTML(idTask) {
  return /*html*/ `
        <div id="detailCardID" class="detailCardTaskToDo">
            ${detailCardHTMLLabel(idTask)}
            ${detailCardHTMLTitle(idTask)}
            ${detailCardHTMLContent(idTask)}
            ${detailCardHTMLDate(idTask)}
            ${detailCardHTMLPriority(idTask)}
            ${detailCardHTMLContacts(idTask)}
            ${detailCardHTMLSubtasks(idTask)}
            ${detailCardHTMLDeleteEdit(idTask)}
        </div>
    `;
}

/**
Diese Funktion ruft die einzelnen Tasks auf und ordnet die zu der passenden Spalte
*/
function showTasks() {
  let tasksToDo = 0; let tasksInProgress = 0; let tasksAwaitFeedback = 0; let tasksDone = 0;
  setBackColumns();
  if (tasksBd == null)
    return checkNoTasks(tasksToDo,tasksInProgress,tasksAwaitFeedback,tasksDone);
  for (let i = 0; i < tasksBd.length; i++) {
    if(tasksBd[i] === null) tasksBd[i]++;
    else {
      if (tasksBd[i].taskApplication == 0) tasksToDo += addTaskBoard(i, "toDO");
      else if (tasksBd[i].taskApplication == 1) tasksInProgress += addTaskBoard(i, "inProgress");
      else if (tasksBd[i].taskApplication == 2) tasksAwaitFeedback += addTaskBoard(i, "awaitFeedback");
      else if (tasksBd[i].taskApplication == 3) tasksDone += addTaskBoard(i, "done");
    }}
  checkNoTasks(tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
}

/**
Diese Funktion fügt dem Board die einzelnen Tasks zu
@param {string} idTask - Ist der Index des Tasks
@param {string} idApplication - Ist der Index der Spalte
*/
function addTaskBoard(idTask, idApplication) {
  document.getElementById(idApplication).innerHTML += cardHTML(idTask);
  return 1;
}

/**
Diese Funktion überprüft, ob die einzelnen Subtasks schon ausgewählt worden sind, damit die später richtig gerendert werden
@param {string} idTask - Ist der Index des Tasks
*/
function getCheckedTasks(idTask) {
  let checkedTasks = 0;
  for (let i = 0; i < tasksBd[idTask]["subtasks"].length; i++)
    if (tasksBd[idTask]["subtasks"][i]["checked"] == 1) checkedTasks++;
  return checkedTasks;
}

/**
Diese Funktion speichert den Zustand der einzelnen Tasks ab
@param {string} idTask - Ist der Index des Tasks
@param {string} idCheckBox - Ist der Index des Subtasks
*/
function toggleCheckbox(idTask, idCheckBox) {
  let isChecked = document.getElementById("checkCard" + idTask + idCheckBox).checked;

  tasksBd[idTask]["subtasks"][idCheckBox]["checked"] = isChecked;
  renderTasks();
  putDataBoard((path = ""), tasksBd);
}

/**
Diese Funktion löscht ein Task vom Board
@param {string} idTask - Ist der Index des Tasks
*/
function deleteTaskBoard(idTask) {
  tasksBd.splice(idTask, 1);
  closeDetailCard(idTask);
  renderTasks();
  putDataBoard((path = ""), tasksBd);
}

/**
Diese Funktion sucht Tasks, die den gesuchten Begriff im Titel oder in der Beschreibung besitzen
*/
function searchTasks() {
  let input = 0;
  if (window.innerWidth <= 1200)
    input = document.getElementById("searchTaskMobil").value;
  else input = document.getElementById("searchTaskDesktop").value;
  input = input.toLowerCase();

  if (!input.length) renderTasks();
  else {
    setBackColumns();
    showSearchTasks(input);
  }
}

/**
Diese Funktion zeigt die Tasks an, die den gesuchten Begriff enthalten
@param {string} input - der gesuchte Begriff
*/
function showSearchTasks(input) {
  let tasksToDo = 0; let tasksInProgress = 0; let tasksAwaitFeedback = 0; let tasksDone = 0;
  for (let i = 0; i < tasksBd.length; i++) {
    let text = tasksBd[i].description;
    let title = tasksBd[i].title;
    if      (tasksBd[i].taskApplication == 0 && (text.toLowerCase().includes(input) || title.toLowerCase().includes(input))) tasksToDo += addTaskBoard(i, "toDO");
    else if (tasksBd[i].taskApplication == 1 && (text.toLowerCase().includes(input) || title.toLowerCase().includes(input))) tasksInProgress += addTaskBoard(i, "inProgress");
    else if (tasksBd[i].taskApplication == 2 && (text.toLowerCase().includes(input) || title.toLowerCase().includes(input))) tasksAwaitFeedback += addTaskBoard(i, "awaitFeedback");
    else if (tasksBd[i].taskApplication == 3 && (text.toLowerCase().includes(input) || title.toLowerCase().includes(input))) tasksDone += addTaskBoard(i, "done");
  }
  checkNoTasksFound(tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
}


/**
Diese Funktion rendert die gefunden Task nach der Suche 
*/
function foundTask() {
  setBackColumns();
  renderTasks();
}

/**
Diese Funktion merkt sich den Task, der aktuell verschoben wird
@param {string} idTask - Ist der Index des Tasks
*/
function startDragging(idTask) {
  currentTask = idTask;
}

/**
Diese Funktion ermöglicht das verschieben der Tasks mittels der Maus
*/
function allowDrop(ev) {
  ev.preventDefault();
}

/**
Diese Funktion speichert den neuen Ort des Tasks ab und rendert das Board neu
@param {string} category - Ist der Name der Spalte, wo der aktuelle Task hinvorschoben wurde
*/
function drop(category) {
  tasksBd[currentTask]["taskApplication"] = category;
  renderTasks();
  putDataBoard((path = ""), tasksBd);
}

/**
Diese Funktion übergibt alle Tasks
*/
function getTasks() {
  return tasksBd;
}

/**
Diese Funktion zeigt in der Edit-Funktion die ausgewählte Priorität an
@param {string} idTask - Ist der Index des Tasks
*/
function openEditPrio(idTask){
  if(tasksBd[idTask].prio == 1)
    changePrioButtonUrgent();
  else if(tasksBd[idTask].prio == 2)
    changePrioButtonMedium();
  else if(tasksBd[idTask].prio == 3)
    changePrioButtonLow();
}

/**
Diese Funktion zeigt in der Edit-Funktion den Titel, die Beschreibung, das Datum und die Kategorie an
@param {string} idTask - Ist der Index des Tasks
*/
function openEditTitleDescriptionDateCategory(idTask){
  document.getElementById("input-title").value = tasksBd[idTask].title;
  document.getElementById("input-description").value = tasksBd[idTask].description;
  document.getElementById("input-date").value = formatDateEdit(tasksBd[idTask].date);
  document.getElementById("input-category").value = tasksBd[idTask].category;
}

/**
Diese Funktion zeigt in der Edit-Funktion die Subtasks an
@param {string} idTask - Ist der Index des Tasks
*/
function openEditSubtasks(idTask){
  let inputs = document.getElementById("show-subtask");
  inputs.innerHTML = "";

  if(tasksBd[idTask].subtasks)
  {
    for (let i = 0; i < tasksBd[idTask].subtasks.length; i++) {
      let showtasks = tasksBd[idTask].subtasks[i];
      tasks.push(showtasks.text);
      inputs.innerHTML += showSubtaskTemplate(i, showtasks.text);
    }    
  } 
}

/**
Diese Funktion zeigt in der Edit-Funktion die ausgewählten Kontakte an
@param {string} idTask - Ist der Index des Tasks
*/
function openEditContacts(idTask){
  let initial = []; let count = 0;
  let ini = document.getElementById("display-initials");
  ini.innerHTML = "";
  for(let i = 0; i < tasksBd[idTask]["assigned to"].length; i++){
    initial.push(getInitials(tasksBd[idTask]["assigned to"][i].name));
    updateCheckEdit(tasksBd[idTask]["assigned to"][i].name);
    namesFromContacts.push(tasksBd[idTask]["assigned to"][i].name);}
  for (let i = 0; i < initial.length; i++) {
    if(i < 4){
      ini.innerHTML += displayInitials(i, initial[i]);
      initalsBackgroundColor(i);
    }else count++;}
  if(count) ini.innerHTML += displayInitialsNumber(count);
}

/**
Diese Funktion öffnet das Edit-Popup
@param {string} idTask - Ist der Index des Tasks
*/
function openEdit(idTask){
  clearInputsEdit();
  useEditFunction = 1;
  displayAddTask();
  openEditTitleDescriptionDateCategory(idTask);
  openEditPrio(idTask);
  if(tasksBd[idTask]["assigned to"])
    openEditContacts(idTask);
  document.getElementById("display-initials").classList.remove("d-none");
  document.getElementById("display-initials").classList.add("z1");
  openEditSubtasks(idTask);
}

