import { closeModal as closeMainModal } from "./bookmarks/modals"; // Для закрытия основной модалки
import folderIMG from '../images/folder.svg'; // Дефолтная иконка папки
import defaultBookmarkFavicon from '../images/dashboard-test.svg'; // Дефолтный фавикон ссылки
import editImg from '../images/edit.svg';
import deleteImg from '../images/delete.svg';

// --- Утилиты (пока оставим здесь, но лучше вынести) ---
function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`;
    } catch (e) {
        return defaultBookmarkFavicon;
    }
}

function escapeHtml(str = '') {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
// --- Конец утилит ---

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    const folderDetailsBackdrop = document.querySelector('.js-folder-details-backdrop'); // Добавлен JS-префикс для унификации
    const folderDetailsModal = document.querySelector('.folder-details-modal');
    const folderDetailsTitle = document.querySelector('.folder-details-title');
    const folderNameEditInput = document.querySelector('.folder-name-edit-input');
    const folderLinksList = document.querySelector('.folder-links-list'); // UL для ссылок в модалке
    const deleteFolderBtn = document.querySelector('.delete-folder-btn');
    const saveFolderNameBtn = document.querySelector('.save-folder-name-btn');
    const closeDetailsModalBtn = document.querySelector('.close-details-modal-btn');

    let currentFolderId = null; // Использование ID вместо индекса более надежно
    let allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];

    // Utility: save bookmarks to localStorage
    function saveBookmarksToLocalStorage() {
        localStorage.setItem('dashMarkBookmarks', JSON.stringify(allBookmarks));
    }

    // Utility: add to history (импортируется из history.js или дублируется)
    // Так как addToHistory уже есть в history.js и этот файл (folder-details-modal.js)
    // не должен быть ответственен за добавление в историю напрямую,
    // а только за рендеринг ссылок с правильными атрибутами для глобального слушателя.
    // Оставляем это на глобальный слушатель в history.js, который теперь будет видеть атрибуты.

    // Render links inside the folder details modal
    function renderFolderLinks(folder) {
        if (!folderLinksList) {
            console.error('Folder links list element .folder-links-list not found in modal.');
            return;
        }

        folderLinksList.innerHTML = '';
        if (!folder || !folder.links || folder.links.length === 0) {
            folderLinksList.innerHTML = '<li class="no-links-message">No links in this folder yet.</li>';
            return;
        }

        folder.links.forEach((link, linkIndex) => {
            const favicon = getFaviconUrl(link.url);
            const listItem = document.createElement('li');
            listItem.classList.add('folder-link-item');

            listItem.innerHTML = `
                <div class="link-info">
                    <img src="${escapeHtml(favicon)}" alt="favicon" class="link-favicon">
                    <a href="${escapeHtml(link.url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="link-title"
                        data-link-id="${escapeHtml(link.id)}"
                        data-folder-id="${escapeHtml(folder.id)}"> ${escapeHtml(link.title)}
                    </a>
                </div>
                <div class="link-actions">
                    <button class="edit-link-btn" data-link-index="${linkIndex}" title="Edit Link">
                        <img src="${editImg}" alt="Edit" width="18" height="18">
                    </button>
                    <button class="delete-link-btn" data-link-index="${linkIndex}" title="Delete Link">
                        <img src="${deleteImg}" alt="Delete" width="18" height="18">
                    </button>
                </div>
            `;
            folderLinksList.appendChild(listItem);
        });
    }

    // Open folder details modal
    function openFolderDetailsModal(folderId) { // Принимаем ID, а не имя
        allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];
        const folder = allBookmarks.find(f => String(f.id) === String(folderId));

        if (!folder) {
            console.error(`Folder with ID "${folderId}" not found.`);
            return;
        }

        currentFolderId = folder.id; // Сохраняем ID текущей папки
        folderDetailsTitle.textContent = escapeHtml(folder.name);
        folderNameEditInput.value = escapeHtml(folder.name);
        renderFolderLinks(folder);

        if (folderDetailsBackdrop) {
            folderDetailsBackdrop.classList.add('is-open');
        }
        if (mainContent) {
            mainContent.classList.add('has-modal-open'); // Добавляем класс для затемнения основного контента
        }
    }

    // Close folder details modal
    function closeFolderDetailsModal() {
        if (folderDetailsBackdrop) {
            folderDetailsBackdrop.classList.remove('is-open');
        }
        if (mainContent) {
            mainContent.classList.remove('has-modal-open'); // Удаляем класс
        }
        currentFolderId = null; // Сбрасываем ID
        // Перезагружаем все закладки на главной странице, чтобы обновить их
        window.dispatchEvent(new Event('bookmarksUpdated'));
    }

    // Event listener for opening folder details
    // Должен быть на родительском элементе, который содержит папки, например .folders-grid
    // Если .folders-grid рендерится render-bookmarks.js, то он будет иметь data-folder-id
    const foldersGrid = document.querySelector('.folders-grid');
    if (foldersGrid) {
        foldersGrid.addEventListener('click', (event) => {
            const folderCard = event.target.closest('.folder-card');
            if (folderCard && !event.target.closest('.folder-actions-btn')) { // Исключаем клики по кнопкам действий внутри карточки
                const folderId = folderCard.dataset.folderId; // Получаем ID
                if (folderId) {
                    openFolderDetailsModal(folderId);
                } else {
                    console.warn('Folder card clicked without data-folder-id:', folderCard);
                }
            }
        });
    } else {
        console.warn('Element .folders-grid not found. Folder details modal opening might not work.');
    }


    // Close modal button
    if (closeDetailsModalBtn) closeDetailsModalBtn.addEventListener('click', closeFolderDetailsModal);

    // Close modal on backdrop click
    if (folderDetailsBackdrop) {
        folderDetailsBackdrop.addEventListener('click', (event) => {
            if (event.target === folderDetailsBackdrop) {
                closeFolderDetailsModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && folderDetailsBackdrop?.classList.contains('is-open')) {
            closeFolderDetailsModal();
        }
    });

    // Delete Folder button handler
    if (deleteFolderBtn) {
        deleteFolderBtn.addEventListener('click', () => {
            if (!currentFolderId) return;

            const folderIndex = allBookmarks.findIndex(f => String(f.id) === String(currentFolderId));
            if (folderIndex === -1) return;

            const folder = allBookmarks[folderIndex];
            if (confirm(`Are you sure you want to delete the folder "${folder.name}" and all its links?`)) {
                allBookmarks.splice(folderIndex, 1);
                saveBookmarksToLocalStorage(); // Используем унифицированную функцию
                closeFolderDetailsModal();
                // location.reload(); // Обычно не нужно, если event 'bookmarksUpdated' обрабатывается
            }
        });
    } else {
        console.warn('Delete folder button .delete-folder-btn not found.');
    }


    // Save Folder Name button handler
    if (saveFolderNameBtn) {
        saveFolderNameBtn.addEventListener('click', () => {
            if (!currentFolderId) return;

            const folderIndex = allBookmarks.findIndex(f => String(f.id) === String(currentFolderId));
            if (folderIndex === -1) return;

            const oldName = allBookmarks[folderIndex].name;
            const newName = folderNameEditInput.value.trim();

            if (!newName) {
                alert('Folder name cannot be empty.');
                return;
            }

            if (newName.toLowerCase() === oldName.toLowerCase()) {
                alert('Folder name is the same.');
                return;
            }

            const isDuplicate = allBookmarks.some((folder, index) =>
                String(folder.id) !== String(currentFolderId) && folder.name.toLowerCase() === newName.toLowerCase()
            );

            if (isDuplicate) {
                alert('A folder with this name already exists. Please choose a different name.');
                return;
            }

            allBookmarks[folderIndex].name = newName;
            saveBookmarksToLocalStorage(); // Используем унифицированную функцию
            folderDetailsTitle.textContent = escapeHtml(newName);
            alert('Folder name updated successfully!');

            window.dispatchEvent(new Event('bookmarksUpdated'));
            closeFolderDetailsModal();
            // location.reload(); // Обычно не нужно, если event 'bookmarksUpdated' обрабатывается

            // Обновление карточки на главной странице будет через 'bookmarksUpdated'
        });
    } else {
        console.warn('Save folder name button .save-folder-name-btn not found.');
    }


    // Event delegation for link actions (edit/delete) inside folderLinksList
    if (folderLinksList) {
        folderLinksList.addEventListener('click', (event) => {
            const target = event.target;
            const deleteBtn = target.closest('.delete-link-btn');
            const editBtn = target.closest('.edit-link-btn');

            // Find linkIndex using data-link-index from the button
            const linkIndexAttr = deleteBtn?.dataset.linkIndex || editBtn?.dataset.linkIndex;
            const linkIndex = parseInt(linkIndexAttr);

            if (!currentFolderId || isNaN(linkIndex)) return;

            const folder = allBookmarks.find(f => String(f.id) === String(currentFolderId));
            if (!folder || !folder.links || linkIndex >= folder.links.length) return;

            if (deleteBtn) {
                const linkTitle = folder.links[linkIndex].title;
                if (confirm(`Are you sure you want to delete the link "${linkTitle}"?`)) {
                    folder.links.splice(linkIndex, 1);
                    saveBookmarksToLocalStorage();
                    renderFolderLinks(folder); // Перерендеринг списка ссылок в модалке
                    window.dispatchEvent(new Event('bookmarksUpdated')); // Обновить основной грид
                }
            } else if (editBtn) {
                const linkToEdit = folder.links[linkIndex];
                const newLinkName = prompt("Enter a new link title: ", linkToEdit.title);

                if (newLinkName !== null && newLinkName.trim() !== "") { // Проверка на null (отмена) и пустую строку
                    linkToEdit.title = newLinkName.trim();
                    saveBookmarksToLocalStorage();
                    renderFolderLinks(folder); // Перерендеринг списка ссылок в модалке
                    alert("Link title updated!");
                    window.dispatchEvent(new Event('bookmarksUpdated')); // Обновить основной грид
                }
            }
        });
    } else {
        console.warn('Folder links list .folder-links-list not found for click delegation.');
    }


    window.addEventListener('bookmarksUpdated', () => {
        allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];

        // Если модалка папки открыта, перерендерим её содержимое, если папка всё ещё существует
        if (folderDetailsBackdrop?.classList.contains('is-open') && currentFolderId) {
            const currentFolder = allBookmarks.find(f => String(f.id) === String(currentFolderId));
            if (currentFolder) {
                renderFolderLinks(currentFolder);
            } else {
                // Если папка была удалена, закрываем модалку
                closeFolderDetailsModal();
            }
        }
        // render-bookmarks.js будет обрабатывать renderAllBookmarks() сам
    });
});