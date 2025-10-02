// Импорт основного функционала PNotify из @pnotify/core
import { alert, notice, info, success, error } from '@pnotify/core';

import '@pnotify/core/dist/PNotify.css'; 
// import '@pnotify/brighttheme/dist/PNotifyBrightTheme.css';


// import * as PNotifyButtons from '@pnotify/buttons';
// import '@pnotify/buttons/dist/PNotifyButtons.css';
// import { defaultModules } from '@pnotify/core';
// defaultModules.set(PNotifyButtons, {});


const userData = JSON.parse(localStorage.getItem("dashMarkBookmarks"));
const box = document.querySelector(".folders-grid")


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

function renderElemnts() {
  const markup = userData.map(data => data = `
            <div class="folder-card" data-folder-name="${data.name}" style="--folder-color: ${getRandomColor()};">
                <div class="folder-header">
                    <img src="${data.icon}" alt="folder icon" class="folder-icon"/>
                    <span class="folder-name">${data.name}</span>
                </div>
                <div class="folder-preview-icons">
                </div>
            </div>
        `
  ).join(' ')

  box.innerHTML = markup
};

function onClickError(e) {
  if(e.target.nodeName === "DIV" || e.target === "SPAN" || e.target === "IMG") {
    notice({
          title: 'Ошибка',
          text: 'Эта функция пока недоступна.',
          delay: 2000      
    })
  }
}


box.addEventListener('click', onClickError)
renderElemnts();



