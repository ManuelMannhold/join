/**
Diese Funktion bringt das Datum in die notwendige Form
@param {string} inputDate - Ist das Datum
*/
function formatDateEdit(inputDate) {
    let dateParts = inputDate.split('/');
    let formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    return formattedDate;
  }
  
  let toogleView = 0;
  let openChangeColumn = 0;
  
  /**
  Diese Funktion öffnet die Auswahl, um den Task in eine andere Spalte zu verschieben
  @param {string} idTask - Ist der Index des Tasks
  */
  function changeColumn(idTask, event, stopPro){
    openChangeColumn = idTask;
    let idChange = "changeColumn" + openChangeColumn;
    if(toogleView){
      document.getElementById(idChange).classList.add("d-none");
      toogleView = 0;
    }else{
      document.getElementById(idChange).classList.remove("d-none");
      dropDownCheckHTML(idTask);
      toogleView = 1;
    }
    if (stopPro) 
      event.stopPropagation();
  }
  
  /**
  Diese Funktion definiert die Auswahl des Dropdowns
  @param {string} idTask - Ist der Index des Tasks
  */
  function dropDownCheckHTML(idTask){
    let idChange = "changeColumn" + openChangeColumn;
    if(!tasksBd[idTask].taskApplication)
      document.getElementById(idChange).innerHTML = dropDownChangeColumn(0, idTask);
    else if(tasksBd[idTask].taskApplication == 1)
      document.getElementById(idChange).innerHTML = dropDownChangeColumn(1, idTask);
    else if(tasksBd[idTask].taskApplication == 2)
      document.getElementById(idChange).innerHTML = dropDownChangeColumn(2, idTask);
    else
      document.getElementById(idChange).innerHTML = dropDownChangeColumn(3, idTask);
  }
  
  /**
  Diese Funktion speichert den die neue Spalte im Task und rendert die neuen Tasks
  @param {string} idTask - Ist der Index des Tasks
  @param {string} index - Ist der Index der neuen Spalte
  */
  function moveToColumn(index, idTask, event, stopPro){
    tasksBd[idTask].taskApplication = index;
    renderTasks();
    putDataBoard((path = ""), tasksBd);
  
    if (stopPro) 
      event.stopPropagation();
  }
  