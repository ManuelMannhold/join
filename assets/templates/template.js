/**
Diese Funktion bindet die template.html in den anderen Funktionen ein
*/
let resultTemplate = false;
function includeHTML() {
  let z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      resultTemplate = true;
      return;
    }
  }
}

/**
Diese Funktion initialisiert die template.html
*/
function initHTML(){
  includeHTML();
  setTimeout(() => {
    hoverSidebar();
  }, 500);
}

let noneLoginName = 0;

/**
Diese Funktion ermittelt, was von der Sidebar angezeigt werden darf -> Login, Guest und Fremder
*/
function hoverSidebar(){
  let path = window.location.pathname;
  let page = path.split("/").pop();
  let docu = document.referrer;
  const index = docu.lastIndexOf('/') + 1; // Find the position of the last '/'
  const fileName = docu.substring(index);
  noneLoginName = 1;

  if((fileName == "index.html") && ((page == "privacy_policy.html") || (page == "legal_notice.html"))) dnoneSidbar();
  else if((fileName == "signup.html") && ((page == "privacy_policy.html") || (page == "legal_notice.html"))) dnoneSidbar();
  else dSidbar();
  
  setHoverFrames(page)
  setInitialsName(); 
  setHelpTemplate();
}

/**
Diese Funktion blendet die Sidebar aus
*/
function dnoneSidbar(){
  document.getElementById("menu_Sidebar").classList.add("d-none");
  document.getElementById("privacyNav").classList.add("d-none");
  document.getElementById("headerNote").classList.add("d-none");
  noneLoginName = 0;
}

/**
Diese Funktion blendet die Sidebar ein
*/
function dSidbar(){
  document.getElementById("menu_Sidebar").classList.remove("d-none");
  document.getElementById("privacyNav").classList.remove("d-none");
}

/**
Diese Funktion rendert die Help Seite
*/
function setHelpTemplate(){}

/**
Diese Funktion ermittelt, welche Kategorie in der Nav-Bar gehovert werden muss
  @param {string} page - aktuelle Seite
*/
function setHoverFrames(page){
  if(page == "summary.html")
    setHover("frameSummary", "imgFrameSummary", "imgHoverSummary");
  if(page == "add_task.html")
    setHover("frameAddtasks", "imgFrameAddtask", "imgHoverAddtask");
  if(page == "board.html")
    setHover("frameBoard", "imgFrameBoard", "imgBoardHover");
  if(page == "contacts.html")
    setHover("frameContacts", "imgFrameContacts", "imgHoverContacts");
  if(page == "privacy_policy.html")
    document.getElementById("framePolicy").classList.add("framesPolicy");
  if(page == "legal_notice.html"){
    document.getElementById("frameNotice").classList.add("framesPolicy");
  }    
}

/**
Diese Funktion definiert, dass die Kategorie auf der geöffneten Seite nicht gehovert werden kann
@param {string} frame - Ist der Index der Kategorie
@param {string} imgFrame - Ist der Index des Bildes der Kategorie
@param {string} imgHover - Ist die Klasse des Hover-Bilds
*/
function setHover(frame, imgFrame, imgHover){
  document.getElementById(frame).classList.add("nohover");
  document.getElementById(frame).classList.add("menuFramesHover");
  document.getElementById(imgFrame).classList.add(imgHover);
}

/**
Diese Funktion stellt die Kürzel dar -> G - Guest, MG - Initialien der Login Person
*/
function setInitialsName(){
  let name = loadLoginName();
  if(name == null)
    document.getElementById("idLoginName").innerHTML = "G";
  else{
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
  
    document.getElementById("idLoginName").innerHTML =  initials;
  }
}

/**
Diese Funktion ermittelt, welche Kategorie in der Nav-Bar gehovert werden muss
@param {string} name - Ist der Name der Login Person
*/
function getInitials(name) {
  if(name == null)
    return "G";
  const nameParts = name.split(' ');
  const initials = nameParts.map(part => part.charAt(0)).join('');

  return initials;
}

let clickName = 0;
/**
Diese Funktion öffnet die Leiste bei den Kontakt-Initialien
*/
function openNoteHeader(){
  if(!noneLoginName)
    clickName = 0;
  else if(clickName)
    clickName = 0;
  else
    clickName = 1;
}

/**
Diese Funktion wird bei einem "Click" geöffnet
*/
window.addEventListener("click", function(event) {
  if(clickName == 1){
    document.getElementById("headerNote").classList.remove("d-none");
    clickName = 2;
  }else{
    document.getElementById("headerNote").classList.add("d-none");
    clickName = 0;
  }
  let path = window.location.pathname;
  let page = path.split("/").pop();
  if(page == "board.html" && !openEditChangeSubtasks)
  {
    closeEdit(event);
    closeChangeColumn();
  }
  openEditChangeSubtasks = 0;
});

/**
Diese Funktion schließt die Auswahl der möglichen neuen Spalten
*/
function closeChangeColumn(){
  let idChange = "changeColumn" + openChangeColumn;
  document.getElementById(idChange).classList.add("d-none");
  document.getElementById("dragTask").classList.remove("opacity");
  toogleView = 0;
}

/**
Diese Funktion schließt das Edit-PopUp Fenster
*/
function closeEdit(event){
  if( document.getElementById("idEditCard").classList.contains("d-none") && !document.getElementById("idDetailCard").classList.contains("d-none"))
    {
      if(event.target == document.getElementById('idDetailCard'))
        closeDetailCard();
    }
  
    else if(event.target == document.getElementById('idEditCard'))
      document.getElementById("idEditCard").classList.add("d-none");
}

/**
Diese Funktion öffnet die Startseite
*/
function openIndex() {
  window.location.href = "../index.html";
}

/**
Diese Funktion öffnet die vorherige Seite
*/
function backToSide(){
  history.back();
}