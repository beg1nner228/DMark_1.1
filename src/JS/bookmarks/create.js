// const createFolderForm = document.querySelector(".new-folder-form");
// const bookmarkContainer = document.querySelector(".bookmark-list"); 
// const savedData = localStorage.getItem('dashMarkBookmarks');

// // 1. Улучшенная инициализация: если savedData - null или пустая строка, используем []
// let allBookmarks = savedData && savedData.trim() !== "" ? JSON.parse(savedData) : []; 

// // ===================================================================
// // 2. ИСПРАВЛЕННЫЕ ФУНКЦИИ РЕНДЕРИНГА
// //    Карточка теперь обернута в <li> для правильной семантики UL/LI
// // ===================================================================

// function createLinkHTML({ title, url }) {
//     // Временно заменил title на URL, если title пустой, чтобы ссылки были кликабельны
//     const linkTitle = title || url; 
//     return `<a href="${url}">${linkTitle}</a>`;
// }

// function createFolderHTML(folderData) {
//     const linksHTML = folderData.links.map(createLinkHTML).join('');
    
//     // ВАЖНО: Вместо <div class="slide">, используем <li> для UL/LI
//     const folderHTML = `
//         <li class="slide">
//             <div class="folder-card">
//                 <div class="folder-header">
//                     <img
//                         src="${folderData.icon}"
//                         alt="folder icon"
//                         class="folder-icon"
//                     />
//                     <span class="folder-name">${folderData.name}</span>
//                 </div>
//                 <div class="folder-preview">
//                     ${linksHTML}
//                 </div>
//             </div>
//         </li> 
//     `;
//     return folderHTML;
// }

// function renderAllBookmarks() {
//     const allFoldersHTML = allBookmarks.map(createFolderHTML).join('');
    
//     // Очищаем и вставляем новую разметку
//     bookmarkContainer.innerHTML = allFoldersHTML;
// }


// // ===================================================================
// // 3. ФУНКЦИЯ ОБРАБОТКИ ФОРМЫ
// // ===================================================================

// function saveBookmarksToLocalStorage() {
//     localStorage.setItem('dashMarkBookmarks', JSON.stringify(allBookmarks));
// }

// function onSubmitForm(event) {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);
//     const formValues = Object.fromEntries(formData.entries());

//     const folderName = formValues.folderName.trim();
//     const bookmarkURL = formValues.bookmarkURL.trim();
//     const bookmarkTitle = formValues.bookmarkTitle.trim(); // Оставляем trim()

//     // ПРОВЕРКА: Не даем создать папку с пустым именем или ссылку с пустым URL
//     if (!folderName || !bookmarkURL) {
//          console.error("Folder name and Bookmark URL are required.");
//          return; 
//     }
    
//     const newLink = {
//         // Если заголовок пустой, используем URL, чтобы ссылка не была пустой
//         title: bookmarkTitle || bookmarkURL, 
//         url: bookmarkURL
//     };

//     const existingFolderIndex = allBookmarks.findIndex(folder => 
//         folder.name.toLowerCase() === folderName.toLowerCase()
//     );

//     if (existingFolderIndex !== -1) {
//         // Папка существует: добавляем ссылку
//         allBookmarks[existingFolderIndex].links.push(newLink);
//     } else {
//         // Папки нет: создаем новую
//         const newFolder = {
//             name: folderName,
//             icon: './src/images/folder.svg', 
//             links: [newLink] 
//         };
//         allBookmarks.push(newFolder);
//     }

//     saveBookmarksToLocalStorage();
//     renderAllBookmarks(); // Обновляем HTML

//     event.currentTarget.reset();
//     // Добавьте здесь код для закрытия модального окна (если он не в другом месте)
//     // document.body.classList.remove('show-modal');
// }


// // ===================================================================
// // 4. ЗАПУСК
// // ===================================================================

// // Вызываем рендеринг, чтобы отобразить сохраненные папки при загрузке
// if (allBookmarks.length > 0) {
//     renderAllBookmarks();
// } else {
//     console.log("Your data is empty, dashboard is ready."); 
// }

// // Добавляем слушателя событий
// createFolderForm.addEventListener("submit", onSubmitForm);
