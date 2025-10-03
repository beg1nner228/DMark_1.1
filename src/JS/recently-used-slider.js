// Импорт основного функционала PNotify из @pnotify/core
import { alert, notice, info, success, error } from '@pnotify/core';
import i18next from "i18next";

import  folder from "../images/folder.svg";
import  dashboardTest from "../images/dashboard-test.svg";
import  plusImg from "../images/plus.svg";

import '@pnotify/core/dist/PNotify.css'; 
// import '@pnotify/brighttheme/dist/PNotifyBrightTheme.css';


// import * as PNotifyButtons from '@pnotify/buttons';
// import '@pnotify/buttons/dist/PNotifyButtons.css';
// import { defaultModules } from '@pnotify/core';
// defaultModules.set(PNotifyButtons, {});


const userData = JSON.parse(localStorage.getItem("dashMarkBookmarks")) || [];
const box = document.querySelector(".folders-grid")
const defaultData = [
  { id: "default1", name: "Work", icon: folder },
  { id: "default2", name: "Study", icon: folder },
  { id: "default3", name: "Hobbies", icon: folder },
  { id: "default4", name: "Travel", icon: folder },
  { id: "default5", name: "Ideas", icon: folder }
];



function getRandomColor() {

  const r = getRandomNum();
  const g = getRandomNum();
  const b = getRandomNum();
  const rgb = `rgb(${r}, ${g}, ${b})`

  return rgb
}

function getRandomNum() {
  const randomNum = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
  return randomNum;
}

function renderElements() {

  
let dataToRender = [];


  if(userData.length === 0) {
    dataToRender = defaultData;

     const markup = dataToRender.map(data => `
      <div class="folder-card" 
          data-folder-name="${data.name}" 
          style="--folder-color: ${getRandomColor()};" 
          id="${data.id}">
          <div class="folder-header">
              <img src="${data.icon}" alt="folder icon" class="folder-icon"/>
              <span class="folder-name">${data.name}</span>
          </div>
          <div class="folder-preview-icons">
            <img src="${dashboardTest}" alt="something" />
            <img src="${dashboardTest}" alt="something" />
            <img src="${dashboardTest}" alt="something" />
            <img src="${plusImg}" alt="Add" class="add-icon" />
          </div>          
      </div>
    `).join('');

    box.innerHTML = markup;    

    return


  }

  if (userData.length <= 4) {
    // если мало данных — показываем все
    dataToRender = userData;
  } else {
    // если много — берём последние 6
    dataToRender = userData.slice(-5);
  }

  const markup = dataToRender.map(data => `
    <div class="folder-card" 
         data-folder-name="${data.name}" 
         style="--folder-color: ${getRandomColor()};" 
         id="${data.id}">
        <div class="folder-header">
            <img src="${data.icon}" alt="folder icon" class="folder-icon"/>
            <span class="folder-name">${data.name}</span>
        </div>
          <div class="folder-preview-icons"></div>
    </div>
  `).join('');

  box.innerHTML = markup;
}


function onClickError(e) {
  if(e.target.nodeName === "DIV" || e.target === "SPAN" || e.target === "IMG") {
    notice({
          title: i18next.t("notifications.errorTitle"),
          text: i18next.t("notifications.error"),
          delay: 2000     
    })
  }
}


box.addEventListener('click', onClickError)
renderElements();



