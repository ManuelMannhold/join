let tasksBoard = [];
const SUMMARY_URL = "https://join-78ba4-default-rtdb.europe-west1.firebasedatabase.app/";
let result2 = false;
let result3 = true;
let loginName;

/**
Diese Funktion initialisiert die Seite summary.html in der Desktop Version
*/
async function summaryInit(){
  initHTML()
  loadTasksSummary().then((result2) => {
      getSummary();
  });
}

/**
Diese Funktion initialisert die Seite summary.html in der Mobil Version
*/
async function summaryMobilInit(){
  includeHTML();
  loadTasksSummary().then((result3) => {
      window.addEventListener('load', function () {
        hoverSidebar();
      });
      document.getElementById("greetingSummary").innerHTML = getGreeting();
      document.getElementById("nameSummary").innerHTML = loadLoginName();
      setTimeout( function() { openSummary(); }, 2000);
  });
}

/**
Diese Funktion öffnet die Seite summary.html
*/
function openSummary(){
  window.location.href = "./summary.html";
}

/**
Diese Funktion lädt die Tasks
*/
async function loadTasksSummary(){
  let response = await fetch(SUMMARY_URL + ".json");
  let responseToJSON = await response.json();
  tasksBoard = responseToJSON;
  result2 = true;
  result3 = true;
}

/**
Diese Funktion lädt die Daten auf Firebase hoch
@param {string} data - die zu ladenen Tasks
*/
async function putDataSummary(path="", data={}){
  let response = await fetch(SUMMARY_URL + path + ".json", {
      method: "PUT",
      header: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
  });
  return responseToJson = await response.json();
}

let nrToDO = 0;
/**
Diese Funktion ermittelt die Anzahl der Tasks in "To do"
*/
function getNumberofToDo(){
  if(tasksBoard == null)
    return 0;
  for(let i = 0; i < tasksBoard.length; i++)
    if(tasksBoard[i]["taskApplication"] == 0)
      nrToDO++;
  return nrToDO;
}

let nrDone = 0;
/**
Diese Funktion ermittelt die Anzahl der Tasks in "Done"
*/
function getNumberofDone(){
  if(tasksBoard == null)
    return 0;
  for(let i = 0; i < tasksBoard.length; i++)
    if(tasksBoard[i]["taskApplication"] == 3)
      nrDone++;
  return nrDone;
}

let nrUrgent = 0;
/**
Diese Funktion ermittelt die Anzahl der Tasks mit Urgent als Prio
*/
function getNumberofUrgent(){
  if(tasksBoard == null)
    return 0;
  for(let i = 0; i < tasksBoard.length; i++)
    if(tasksBoard[i]["prio"] == 1)
      nrUrgent++;
  return nrUrgent;
}

/**
Diese Funktion ermittelt die Anzahl aller Tasks 
*/
function getNumberofTasks(){
  if(tasksBoard == null)
    return 0;
  else
    return tasksBoard.length;
}

let nrProgress = 0;
/**
Diese Funktion ermittelt die Anzahl der Tasks in "In Progress"
*/
function getNumberofProgress(){
  if(tasksBoard == null)
    return 0;
  for(let i = 0; i < tasksBoard.length; i++)
    if(tasksBoard[i]["taskApplication"] == 1)
      nrProgress++;
  return nrProgress;
}

let nrAwait = 0;
/**
Diese Funktion ermittelt die Anzahl der Tasks in "Await"
*/
function getNumberofAwait(){
  if(tasksBoard == null)
    return 0;
  for(let i = 0; i < tasksBoard.length; i++)
    if(tasksBoard[i]["taskApplication"] == 2)
      nrAwait++;
  return nrAwait;
}

/**
Diese Funktion ruft alle Funktionen auf, um die Summary Seite zu rendern
*/
function getSummary(){
  document.getElementById("summaryToDo").innerHTML = getNumberofToDo();
  document.getElementById("summaryProgress").innerHTML = getNumberofProgress();
  document.getElementById("summaryAwait").innerHTML = getNumberofAwait();
  document.getElementById("summaryDone").innerHTML = getNumberofDone();
  document.getElementById("summaryNrTask").innerHTML = getNumberofTasks();
  document.getElementById("summaryNrUrgent").innerHTML = getNumberofUrgent();
  document.getElementById("summaryDate").innerHTML = getNextDate();
  document.getElementById("greetingSummary").innerHTML = getGreeting();
  document.getElementById("nameSummary").innerHTML = loadLoginName();
}

/**
Diese Funktion ermittelt das Datum, wann der nächste Task ansteht
*/
function getNextDate(){
  if(tasksBoard == null) return '';
  let date = tasksBoard[0]["date"];
  let date1 = new Date(tasksBoard[0]["date"]);
  let date2;
  for(let i = 1; i < tasksBoard.length; i++)
  {
    date2 = new Date(tasksBoard[i]["date"]);
    if(date2 < date1)
      {
        date = tasksBoard[i]["date"];
        date1 = date2;
      }
  }
  return formatDate(date);
}

/**
Diese Funktion formatiert das Datum ins richtige Format
*/
function formatDate(date) {
  let dateParts = date.split("/");

  let day = dateParts[0];
  let month = dateParts[1];
  let year = dateParts[2];

  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let monthName = monthNames[parseInt(month) - 1];
  return `${monthName} ${day}, ${year}`;
}

/**
Diese Funktion ermittelt je nach Uhrzeit die notwendige Begrüßung
*/
function calculateGreeting(currentHour){
  if (currentHour >= 5 && currentHour < 12) 
    return "Good Morning";
  else if (currentHour >= 12 && currentHour < 17) 
    return "Good Afternoon";
  else if (currentHour >= 17 && currentHour < 22) 
    return "Good Evening";
  else
    return "Good Night";
}

/**
Diese Funktion stellt die Begrüßung dar
*/
function getGreeting(){
  let currentDate = new Date(); 
  let currentHour = currentDate.getHours();
  let name = loadLoginName();
  let greeting = calculateGreeting(currentHour);

  if(name != null)
    return greeting + ',';
  else
    return greeting;
}

/**
Diese Funktion ermittelt den Namen der Person, die sich eingeloggt hat
*/
function getLoginName(name){
  let nameAsText = JSON.stringify(name);
  localStorage.setItem("name", nameAsText);
}

/**
Diese Funktion speichert den Namen der Person ab, die sich eingeloggt hat
*/
function loadLoginName() {
  let nameAsText = localStorage.getItem("name", loginName);
  if (nameAsText == "null")
    return null; 
  if (nameAsText) 
    return JSON.parse(nameAsText);
}

