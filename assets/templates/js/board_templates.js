/**
Diese Funktion rendert das Label von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLLabel(idTask) {
  if (tasksBd[idTask].category == "User Story") {
    return detailCardHTMLLabelUser(idTask);
  } else {
    return detailCardHTMLLabelTechnical(idTask);
  }
}

/**
Diese Funktion rendert den Label-USer von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLLabelUser(idTask){
  return /*html*/ `
        <div class="labelClose">
            <div class="labelDetailCard labelCard-blue">${tasksBd[idTask].category}</div>
            <div class="imgPrio hoverCloseDetailCard flex-center" onclick="closeDetailCard(${idTask})">
                <img class="closeDetailCard" src="../assets/img/close.png" alt="">
            </div>
        </div>`;
}

/**
Diese Funktion rendert das Label-Technical von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLLabelTechnical(idTask){
  return /*html*/ `
        <div class="labelClose">
            <div class="labelDetailCard labelCard-green">${tasksBd[idTask].category}</div>
            <div class="imgPrio hoverCloseDetailCard flex-center" onclick="closeDetailCard(${idTask})">
                <img class="closeDetailCard" src="../assets/img/close.png" alt="">
            </div>
        </div>`;
}

/**
Diese Funktion rendert den Titel von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLTitle(idTask) {
  return /*html*/ `
        <div class="textDetailCardTitle">${tasksBd[idTask].title}</div>
    `;
}

/**
Diese Funktion rendert den Content von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLContent(idTask) {
  if (tasksBd[idTask].description == null) return "";
  return /*html*/ `
        <div class="textDetailCardContent">${tasksBd[idTask].description}</div>
    `;
}

/**
Diese Funktion rendert das Datum von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLDate(idTask) {
  if (tasksBd[idTask].date == null) return "";
  return /*html*/ `
        <div class="textDetailCardDate">
            <div>Due date:</div>
            <div class="dateDetailCard">${tasksBd[idTask].date}</div>
        </div>
    `;
}

/**
Diese Funktion rendert die Priorität von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLPriority(idTask) {
  if (tasksBd[idTask].prio == null) return "";
  return /*html*/ `
        <div class="textDetailCardPriority">
            <div>Priority:</div>
            <div class="priorityDetailCard">
                <div class="dateDetailCard">${cardHTMLPriorityName(
                  idTask
                )}</div>
                ${cardHTMLPriority(idTask)}
            </div>
        </div>
    `;
}

/**
Diese Funktion gibt den Wortlaut der ausgewählten Priorität zurück
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTMLPriorityName(idTask) {
  if (tasksBd[idTask].prio == 1) return "Urgent";
  if (tasksBd[idTask].prio == 2) return "Medium";
  if (tasksBd[idTask].prio == 3) return "Low";
}

/**
Diese Funktion rendert die Kontakte von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLContacts(idTask) {
  if (tasksBd[idTask]["assigned to"] == null) return "";
  return /*html*/ `
        <div class="textDetailCardContacts">
                <div>Assigned To:</div>
                ${getdetailcardHTMLContacts(idTask)}
            </div>
    `;
}

/**
Diese Funktion rendert die einzelnen Kontakte von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function getdetailcardHTMLContacts(idTask) {
  let initials = 0;
  let contactCards = "";
  for (let i = 0; i < tasksBd[idTask]["assigned to"].length; i++) {
    initials = getInitials(tasksBd[idTask]["assigned to"][i].name);
    contactCards += /*html*/ `
            <div class="contactsDetailCard">
                <div class="contactsListCard">
                    <p class="cardContactDetailCard" style="background-color: ${tasksBd[idTask]["assigned to"][i].color}">${initials}</p>
                    <p class="nameContactDetailCard" >${tasksBd[idTask]["assigned to"][i].name}</p>
                </div>
            </div>`;      
  }
  return /*html*/ ` <div class="detailcardContacts">${contactCards}</div>`;
}

/**
Diese Funktion rendert die Subtasks von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLSubtasks(idTask) {
  if (tasksBd[idTask]["subtasks"] == null) return "";
  if (tasksBd[idTask]["subtasks"].length <= 0) return "";
  if (tasksBd[idTask]["subtasks"][0].text == null) return "";
  return /*html*/ `
        <div class="textDetailCardContacts">
            <div>Subtasks:</div>
            ${getDetailcardHTMLSubtasks(idTask)}
        </div>
    `;
}

/**
Diese Funktion rendert die einzelnen Subtasks von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function getDetailcardHTMLSubtasks(idTask) {
  let subtasksCards = "";

  for (let i = 0; i < tasksBd[idTask]["subtasks"].length; i++) {
    subtasksCards += /*html*/ `
        <div class="subtasksListCard">
            <input class="checkboxRememberCard" type="checkbox" id="checkCard${idTask}${i}" onclick="toggleCheckbox(${idTask}, ${i})">
            <label for="checkCard${idTask}${i}" class="checkboxCard">${tasksBd[idTask]["subtasks"][i].text}</label>
        </div>`;
  }

  return /*html*/ ` <div class="subtasksDetailCard">${subtasksCards}</div>`;
}

/**
Diese Funktion rendert das Edit-Label von der Detailcard
@param {string} idTask - Ist der Index des Tasks
*/
function detailCardHTMLDeleteEdit(idTask) {
  return /*html*/ `
        <div class="deleteEditDetailCard">
        <div class="deleteDetailCard" onclick="deleteTaskBoard(${idTask})">
            <div class="imgDetaildelete"></div>
            <p class="textDeleteCard">Delete</p>
        </div>
        <div class="vektorDetailCard"></div>
        <div class="editDetailCard" onclick="openEdit(${idTask})">
            <div class="imgDetailedit"></div>
            <p class="textDeleteCard">Edit</p>
        </div>
    </div>
    `;
}

/**
Diese Funktion rendert die Spalten mit "No Tasks", wenn keine Tasks vorhanden sind
@param {string} tasksToDo - Ist der Index der Spalte "To Do"
@param {string} tasksInProgress - Ist der Index der Spalte "In Progress"
@param {string} tasksAwaitFeedback - Ist der Index der Spalte "Await Feedback"
@param {string} tasksDone - Ist der Index der Spalte "Done"
*/
function checkNoTasks(tasksToDo,tasksInProgress,tasksAwaitFeedback, tasksDone) {
  if (!tasksToDo) document.getElementById("toDO").innerHTML = cardHTMLNoTasks();
  if (!tasksInProgress)
    document.getElementById("inProgress").innerHTML = cardHTMLNoTasks();
  if (!tasksAwaitFeedback)
    document.getElementById("awaitFeedback").innerHTML = cardHTMLNoTasks();
  if (!tasksDone) document.getElementById("done").innerHTML = cardHTMLNoTasks();
}

/**
Diese Funktion rendert die Spalten mit "No Tasks Found", wenn keine Tasks mit dem Suchbegriff gefunden worden sind
@param {string} tasksToDo - Ist der Index der Spalte "To Do"
@param {string} tasksInProgress - Ist der Index der Spalte "In Progress"
@param {string} tasksAwaitFeedback - Ist der Index der Spalte "Await Feedback"
@param {string} tasksDone - Ist der Index der Spalte "Done"
*/
function checkNoTasksFound(tasksToDo,tasksInProgress,tasksAwaitFeedback, tasksDone) {
  if (!tasksToDo) document.getElementById("toDO").innerHTML = cardHTMLNoTasksFound();
  if (!tasksInProgress)
    document.getElementById("inProgress").innerHTML = cardHTMLNoTasksFound();
  if (!tasksAwaitFeedback)
    document.getElementById("awaitFeedback").innerHTML = cardHTMLNoTasksFound();
  if (!tasksDone) document.getElementById("done").innerHTML = cardHTMLNoTasksFound();
}

/**
Diese Funktion rendert einen Task
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTML(idTask) {
  return /*html*/ `
        <div draggable="true" id="taskToDo${idTask}" class="TasksToDo" onclick="openDetailCard(event, ${idTask}, true)" ondragstart="startDragging(${idTask})">
          <div class="titleCard">${cardHTMLLabel(idTask)}
            <img class="dropDown" id="dragTask" src="../assets/img/arrow_drop_down.svg" alt="" onclick="changeColumn(${idTask}, event, true)">
          </div>
          <div id="changeColumn${idTask}" class="d-none infoColumn"></div>            
          <div class="textCard">${cardHTMLTitle(idTask)}${cardHTMLContent(idTask)}</div>
          ${cardHTMLProgressBar(idTask)}
          <div class="contactsPriority">${cardHTMLContacts(idTask)}${cardHTMLPriority(idTask)}</div>
        </div>
    `;
}

/**
Diese Funktion rendert die einzelnen Möglichkeiten, wo der Task verschoben werden kann
@param {string} idTask - Ist der Index des Tasks
@param {string} index - Ist der Index der aktuellen Spalte
*/
function dropDownChangeColumn(index, idTask){
  let document = ``;
  if(index != 0)
    document += `<div class="changeColumnSpan" onclick="moveToColumn(0, ${idTask}, event, true)">To Do</div>`;
  if(index != 1)
    document += `<div class="changeColumnSpan" onclick="moveToColumn(1, ${idTask}, event, true)">In Progress</div>`;
  if(index != 2)
    document += `<div class="changeColumnSpan" onclick="moveToColumn(2, ${idTask}, event, true)">Await Feedback</div>`;
  if(index != 3)
    document += `<div class="changeColumnSpan" onclick="moveToColumn(3, ${idTask}, event, true)">Done</div>`;
  return document;
}

/**
Diese Funktion rendert das Label des Tasks
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTMLLabel(idTask) {
  if (tasksBd[idTask].category == "User Story")
    return /*html*/ `
            <div class="labelCard labelCard-blue">${tasksBd[idTask].category}</div>`;
  else
    return /*html*/ `
            <div class="labelCard labelCard-green">${tasksBd[idTask].category}</div>`;
}

/**
Diese Funktion rendert den Titel des Tasks
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTMLTitle(idTask) {
  return /*html*/ `
        <div class="textCardTitle">${tasksBd[idTask].title}</div>
    `;
}

/**
Diese Funktion rendert den Content des Tasks
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTMLContent(idTask) {
  if (tasksBd[idTask].description == null) tasksBd[idTask].description = "";
  return /*html*/ `
        <div class="textCardContent">${tasksBd[idTask].description}</div>
    `;
}

/**
Diese Funktion rendert die Progressbar des Tasks
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTMLProgressBar(idTask) {
  if (tasksBd[idTask]["subtasks"] == null) return "";
  let maxSubtasks = tasksBd[idTask]["subtasks"].length;
  let checkedTasks = getCheckedTasks(idTask);
  let widthProgress = 128 * (checkedTasks / maxSubtasks);
  if (!maxSubtasks) return ``;
  else if (tasksBd[idTask]["subtasks"][0].text == null) return "";
  else {
    return /*html*/ `
            <div class="textCardProgress">
                <div class="progressBar"><div class="progressBarLine" style="width:${widthProgress}px"></div></div>
                <div class="textProgress">${checkedTasks}/${maxSubtasks} Subtasks</div>
            </div>
    `;
  }
}

/**
Diese Funktion rendert die aktuelle Priorität des Tasks
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTMLPriority(idTask) {
  if (tasksBd[idTask].prio == null) return "";
  if (tasksBd[idTask].prio == 3)
    return /*html*/ `<img class="imgPrio" src="../assets/img/Property 1=Low.png" alt="">`;
  if (tasksBd[idTask].prio == 2)
    return /*html*/ `<img class="imgPrio" src="../assets/img/Property 1=Medium.png" alt="">`;
  if (tasksBd[idTask].prio == 1)
    return /*html*/ `<img class="imgPrio" src="../assets/img/Property 1=Urgent.png" alt="">`;
}

/**
Diese Funktion rendert die Kontakte des Tasks
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTMLContacts(idTask) {
  let initials = 0; let contactCards = "";let leftPosition = 0;

  if (tasksBd[idTask]["assigned to"] == null) return "";
  for (let i = 0; i < tasksBd[idTask]["assigned to"].length; i++) {
    leftPosition = i * 8;
    initials = getInitials(tasksBd[idTask]["assigned to"][i].name);
    contactCards += /*html*/ `<div class="cardContact leftPosition${leftPosition}" style="background-color: ${tasksBd[idTask]["assigned to"][i].color}">${initials}</div>`;
    if(i > 2){
      contactCards += checkMoreContacts(idTask, i);
      break;
    }  
  }
  return /*html*/ `<div class="cardContacts">${contactCards}</div>`;
}

/**
Diese Funktion rendert "+X", wenn mehr Kontakte vorhanden sind
@param {string} idTask - Ist der Index des Tasks
*/
function checkMoreContacts(idTask, i){
    let countContacts = tasksBd[idTask]["assigned to"].length - 4;
    if(countContacts)
      return /*html*/ `<div class="cardContactPlus">+ ${countContacts}</div>`;
    else
    return ``;
}

/**
Diese Funktion rendert das Label "No tasks to do"
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTMLNoTasks(idTask) {
  return /*html*/ `
        <div class="noTasksToDo">No tasks To do</div>
    `;
}

/**
Diese Funktion rendert das Label "No task found"
@param {string} idTask - Ist der Index des Tasks
*/
function cardHTMLNoTasksFound(idTask) {
  return /*html*/ `
        <div class="noTasksToDo">No task found</div>
    `;
}

/**
Diese Funktion generiert die Initialen des Namens
@param {string} name - Ist der Index des Namens
*/
function getInitials(name) {
  if (name == null) return "";
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");

  return initials;
}
