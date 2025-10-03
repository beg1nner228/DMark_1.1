import { nanoid } from 'nanoid';
import defaultBookmarkFavicon from '../images/dashboard-test.svg';
import editImg from '../images/edit.svg';    // Убедитесь, что путь правильный
import deleteImg from '../images/delete.svg'; // Убедитесь, что путь правильный

// ================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==================
// allBookmarks будет обновляться динамически перед использованием
let allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];

// =============== УТИЛИТЫ ===============

/**
 * Экранирует HTML-спецсимволы для предотвращения XSS-атак.
 * @param {string} str Входящая строка.
 * @returns {string} Экранированная строка.
 */
function escapeHtml(str = '') {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

/**
 * Генерирует URL для фавиконки по URL страницы.
 * @param {string} url URL страницы.
 * @returns {string} URL фавиконки или дефолтное изображение.
 */
function getHistoryFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`;
    } catch (e) {
        return defaultBookmarkFavicon;
    }
}

/**
 * Сохраняет текущее состояние allBookmarks в localStorage.
 */
function saveBookmarksToLocalStorage() {
    localStorage.setItem('dashMarkBookmarks', JSON.stringify(allBookmarks));
}

/**
 * Добавляет запись о посещенной ссылке в историю localStorage.
 * Ограничивает количество записей до 1000.
 * @param {object} link Объект ссылки (должен содержать url, title).
 * @param {string|null} folderId ID папки, если ссылка из папки.
 */
function addToHistory(link, folderId = null) {
    let history = JSON.parse(localStorage.getItem('dashMarkHistory')) || [];

    const record = {
        id: nanoid(),
        url: link.url,
        title: link.title,
        folderId: folderId,
        visitedAt: Date.now()
    };

    history.unshift(record); // Добавляем в начало
    if (history.length > 1000) history.pop(); // Ограничиваем историю

    localStorage.setItem('dashMarkHistory', JSON.stringify(history));
}

// =============== МИГРАЦИЯ (гарантируем наличие id и visits) ===============
/**
 * Обеспечивает наличие уникальных ID и счетчика посещений для папок и ссылок
 * в localStorage. Используется при первой загрузке или миграции данных.
 * @returns {Array} Обновленный массив закладок.
 */
function ensureIds() {
    let data = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];
    let changed = false;

    data = data.map(folder => {
        if (!folder.id) {
            folder.id = nanoid();
            changed = true;
        }
        folder.links = (folder.links || []).map(link => {
            if (!link.id) {
                link.id = nanoid();
                changed = true;
            }
            link.visits = link.visits || 0; // Инициализация счетчика посещений
            if (!link.lastVisitedAt) { // Инициализация даты последнего посещения
                link.lastVisitedAt = null;
            }
            return link;
        });
        return folder;
    });

    if (changed) {
        localStorage.setItem('dashMarkBookmarks', JSON.stringify(data));
    }
    return data;
}

// ================= DOMContentLoaded =================
document.addEventListener('DOMContentLoaded', () => {
    // Гарантируем, что все закладки имеют ID и счетчики посещений
    allBookmarks = ensureIds();

    // --- Элементы DOM для модалки истории ---
    const historyBtn = document.querySelector('.historyBtnJS');
    const historyModalBackdrop = document.querySelector('.js-history-modal-backdrop');
    const historyModalCloseBtn = document.querySelector('.js-close-history-modal-btn');
    const historySearchInput = document.querySelector('.js-history-search-input');
    const historyList = document.querySelector('.js-history-list');
    const noHistoryMessage = document.querySelector('.js-no-history-message');

    // --- Элементы DOM для модалки папки (если есть на странице) ---
    const folderLinksList = document.querySelector('.js-folder-links-list'); // Список ссылок внутри модалки папки

    /**
     * Рендерит записи истории в модальном окне.
     * @param {string} [filter=''] Строка для фильтрации записей.
     */
    function renderHistoryEntries(filter = '') {
        const history = JSON.parse(localStorage.getItem('dashMarkHistory')) || [];
        if (!historyList) {
            console.warn('History list element .js-history-list not found for rendering.');
            return;
        }

        historyList.innerHTML = ''; // Очищаем список перед рендерингом

        const filtered = history.filter(entry =>
            entry.title.toLowerCase().includes(filter.toLowerCase()) ||
            entry.url.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            if (noHistoryMessage) noHistoryMessage.style.display = 'block';
        } else {
            if (noHistoryMessage) noHistoryMessage.style.display = 'none';
            filtered.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.classList.add('history-list-item');
                const favicon = getHistoryFaviconUrl(entry.url);
                const visitedDate = new Date(entry.visitedAt).toLocaleString(); // Форматируем дату

                listItem.innerHTML = `
                    <img src="${escapeHtml(favicon)}" alt="favicon" class="history-link-favicon">
                    <a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(entry.title)}</a>
                    <span class="history-visited-at">${visitedDate}</span>
                `;
                historyList.appendChild(listItem);
            });
        }
    }

    /**
     * Открывает модальное окно истории.
     */
    function openHistoryModal() {
        if (historyModalBackdrop) {
            historyModalBackdrop.classList.add('is-open');
            renderHistoryEntries(); // Рендерим историю при открытии
            if (historySearchInput) historySearchInput.value = ''; // Очищаем поиск при открытии
        }
    }

    /**
     * Закрывает модальное окно истории.
     */
    function closeHistoryModal() {
        if (historyModalBackdrop) {
            historyModalBackdrop.classList.remove('is-open');
        }
    }

    // --- Слушатели для модалки истории ---
    if (historyBtn) historyBtn.addEventListener('click', openHistoryModal);
    if (historyModalCloseBtn) historyModalCloseBtn.addEventListener('click', closeHistoryModal);
    if (historyModalBackdrop) {
        historyModalBackdrop.addEventListener('click', (event) => {
            if (event.target === historyModalBackdrop) closeHistoryModal();
        });
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && historyModalBackdrop?.classList.contains('is-open')) {
            closeHistoryModal();
        }
    });
    if (historySearchInput) {
        historySearchInput.addEventListener('input', (e) => {
            renderHistoryEntries(e.target.value.trim());
        });
    }

    // --- Рендер ссылок в модалке папки (если она есть на странице) ---
    /**
     * Рендерит ссылки для конкретной папки в модальном окне деталей папки.
     * Каждая ссылка получает свой собственный слушатель кликов для добавления в историю.
     * @param {object} folder Объект папки с ссылками.
     */
    function renderFolderLinks(folder) {
        if (!folderLinksList) {
            console.warn('Folder links list element .js-folder-links-list not found for rendering.');
            return;
        }

        folderLinksList.innerHTML = '';
        if (!folder || !folder.links || folder.links.length === 0) {
            folderLinksList.innerHTML = '<li class="no-links-message">No links in this folder yet.</li>';
            return;
        }

        folderLinksList.dataset.currentFolderId = folder.id;

        folder.links.forEach((link) => {
            const favicon = getHistoryFaviconUrl(link.url);
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
                        data-folder-id="${escapeHtml(folder.id)}">
                        ${escapeHtml(link.title)}
                    </a>
                </div>
                <div class="link-actions">
                    <button class="edit-link-btn" data-link-id="${escapeHtml(link.id)}" title="Edit Link">
                        <img src="${editImg}" alt="Edit" width="18" height="18">
                    </button>
                    <button class="delete-link-btn" data-link-id="${escapeHtml(link.id)}" title="Delete Link">
                        <img src="${deleteImg}" alt="Delete" width="18" height="18">
                    </button>
                </div>
            `;
            
            // --- ДОБАВЛЕНИЕ СЛУШАТЕЛЯ К КАЖДОЙ ССЫЛКЕ В МОДАЛКЕ ПАПКИ ---
            const linkElement = listItem.querySelector('.link-title');
            if (linkElement) {
                linkElement.addEventListener('click', (e) => {
                    // e.preventDefault(); // Закомментируйте, если хотите, чтобы браузер сразу переходил

                    const clickedLinkId = e.currentTarget.dataset.linkId;
                    const clickedFolderId = e.currentTarget.dataset.folderId;

                    // Обновляем allBookmarks перед поиском, чтобы убедиться в актуальности
                    allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];

                    const targetFolder = allBookmarks.find(f => String(f.id) === String(clickedFolderId));
                    if (!targetFolder) {
                        console.warn('Folder not found for link:', clickedLinkId, 'in folder:', clickedFolderId);
                        return;
                    }

                    const targetLink = (targetFolder.links || []).find(l => String(l.id) === String(clickedLinkId));
                    if (!targetLink) {
                        console.warn('Link not found:', clickedLinkId, 'in folder:', clickedFolderId);
                        return;
                    }

                    addToHistory(targetLink, targetFolder.id);

                    // Обновляем статистику в allBookmarks (по ссылке на объект)
                    targetLink.visits = (targetLink.visits || 0) + 1;
                    targetLink.lastVisitedAt = Date.now();
                    saveBookmarksToLocalStorage(); // Сохраняем обновленные allBookmarks

                    // Если e.preventDefault() был активен, то вам нужно вручную открыть ссылку:
                    // window.open(targetLink.url, '_blank');
                });
            }
            // --- КОНЕЦ ДОБАВЛЕНИЯ СЛУШАТЕЛЯ ---

            folderLinksList.appendChild(listItem);
        });
    }

    // --- Глобальный обработчик для ссылок (из основного грида, не из модалки папки) ---
    document.addEventListener('click', (e) => {
        const clickedLink = e.target.closest('a[data-link-id]');
        
        // Если клик был по ссылке, которая является частью модалки папки,
        // то ее уже обработал внутренний слушатель в renderFolderLinks.
        // Поэтому здесь мы ничего не делаем.
        if (clickedLink && folderLinksList && folderLinksList.contains(clickedLink)) {
            return; 
        }

        if (!clickedLink) return; // Клик не по ссылке с data-link-id

        // e.preventDefault(); // Закомментируйте, если хотите, чтобы браузер сразу переходил

        const linkId = clickedLink.dataset.linkId;
        const folderId = clickedLink.dataset.folderId || null;

        // Обновляем allBookmarks перед поиском, чтобы убедиться в актуальности
        allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];

        let foundLink = null;
        let foundFolder = null;

        // Оптимизированный поиск: сначала ищем по folderId, если он есть
        if (folderId) {
            const folder = allBookmarks.find(f => String(f.id) === String(folderId));
            if (folder) {
                foundFolder = folder;
                foundLink = (folder.links || []).find(l => String(l.id) === String(linkId));
            }
        }

        // Если не нашли по folderId (или folderId не было), ищем по всем папкам
        if (!foundLink) {
            for (const folder of allBookmarks) {
                const maybe = (folder.links || []).find(l => String(l.id) === String(linkId));
                if (maybe) {
                    foundLink = maybe;
                    foundFolder = folder;
                    break;
                }
            }
        }

        if (!foundLink) {
            console.warn('Link not found with ID:', linkId, 'and folder ID:', folderId);
            return; // Ссылка не найдена в allBookmarks, не добавляем в историю
        }

        addToHistory(foundLink, foundFolder ? foundFolder.id : null);

        // Обновляем статистику в allBookmarks (по ссылке на объект)
        foundLink.visits = (foundLink.visits || 0) + 1;
        foundLink.lastVisitedAt = Date.now();
        saveBookmarksToLocalStorage(); // Сохраняем обновленные allBookmarks
    });

    // --- Пример вызова открытия модалки папки ---
    // Эту функцию вы должны вызывать там, где у вас открывается модалка деталей папки
    // (например, при клике на карточку папки в основном гриде).
    // Убедитесь, что 'folderDetailsBackdrop' и другие элементы модалки папки
    // существуют в вашем HTML.
    // function openFolderDetailsModal(folderId) {
    //     allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];
    //     const folder = allBookmarks.find(f => String(f.id) === String(folderId));
    //     if (!folder) return;

    //     const folderDetailsBackdrop = document.querySelector('.folder-details-backdrop'); // Пример элемента модалки
    //     if (folderDetailsBackdrop) {
    //         folderDetailsBackdrop.classList.add('is-open');
    //         // Установите заголовок модалки
    //         const folderNameElement = document.querySelector('.js-folder-details-name');
    //         if (folderNameElement) folderNameElement.textContent = folder.name;
    //         renderFolderLinks(folder); // Рендерим ссылки в модалке папки
    //     }
    // }

    // Здесь может быть код для рендеринга основного грида папок,
    // который при клике на папку будет вызывать openFolderDetailsModal
    // или другую вашу функцию для открытия деталей папки.
    // Например:
    // const foldersGrid = document.querySelector('.folders-grid');
    // if (foldersGrid) {
    //     foldersGrid.addEventListener('click', (e) => {
    //         const folderCard = e.target.closest('.folder-card');
    //         if (folderCard && e.target.closest('.folder-actions-btn')) {
    //             // Клик по кнопке действия, не открываем модалку деталей
    //             return;
    //         }
    //         if (folderCard) {
    //             const folderId = folderCard.dataset.folderId;
    //             if (folderId) {
    //                 openFolderDetailsModal(folderId);
    //             }
    //         }
    //     });
    // }

}); // Конец DOMContentLoaded