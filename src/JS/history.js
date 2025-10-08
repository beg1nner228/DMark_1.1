import { nanoid } from 'nanoid';
import defaultBookmarkFavicon from '../images/dashboard-test.svg';
import editImg from '../images/edit.svg';    
import deleteImg from '../images/delete.svg'; 

let allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];

// =============== УТИЛИТЫ ===============

/**
 * XSS
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
 * Generation of icons.
 * @param {string} url 
 * @returns {string} 
 */
function getHistoryFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`;
    } catch (e) {
        return defaultBookmarkFavicon;
    }
}

function saveBookmarksToLocalStorage() {
    localStorage.setItem('dashMarkBookmarks', JSON.stringify(allBookmarks));
}

/**
 * @param {object} link (url, title).
 * @param {string|null} folderId 
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

    history.unshift(record); 
    if (history.length > 1000) history.pop(); 

    localStorage.setItem('dashMarkHistory', JSON.stringify(history));
}


/**
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
            link.visits = link.visits || 0; 
            if (!link.lastVisitedAt) {
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

// DOMContentLoaded 
document.addEventListener('DOMContentLoaded', () => {
    allBookmarks = ensureIds();

    const historyBtn = document.querySelector('.historyBtnJS');
    const historyModalBackdrop = document.querySelector('.js-history-modal-backdrop');
    const historyModalCloseBtn = document.querySelector('.js-close-history-modal-btn');
    const historySearchInput = document.querySelector('.js-history-search-input');
    const historyList = document.querySelector('.js-history-list');
    const noHistoryMessage = document.querySelector('.js-no-history-message');

    const folderLinksList = document.querySelector('.js-folder-links-list'); 

    /**
     * @param {string} [filter='']
     */
    function renderHistoryEntries(filter = '') {
        const history = JSON.parse(localStorage.getItem('dashMarkHistory')) || [];
        if (!historyList) {
            console.warn('History list element .js-history-list not found for rendering.');
            return;
        }

        historyList.innerHTML = ''; 

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
                const visitedDate = new Date(entry.visitedAt).toLocaleString();

                listItem.innerHTML = `
                    <img src="${escapeHtml(favicon)}" alt="favicon" class="history-link-favicon">
                    <a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(entry.title)}</a>
                    <span class="history-visited-at">${visitedDate}</span>
                `;
                historyList.appendChild(listItem);
            });
        }
    }

    function openHistoryModal() {
        if (historyModalBackdrop) {
            historyModalBackdrop.classList.add('is-open');
            renderHistoryEntries(); 
            if (historySearchInput) historySearchInput.value = ''; 
        }
    }

    function closeHistoryModal() {
        if (historyModalBackdrop) {
            historyModalBackdrop.classList.remove('is-open');
        }
    }

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

    /**
     * @param {object} folder 
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
            
            const linkElement = listItem.querySelector('.link-title');
            if (linkElement) {
                linkElement.addEventListener('click', (e) => {

                    const clickedLinkId = e.currentTarget.dataset.linkId;
                    const clickedFolderId = e.currentTarget.dataset.folderId;

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

                    targetLink.visits = (targetLink.visits || 0) + 1;
                    targetLink.lastVisitedAt = Date.now();
                    saveBookmarksToLocalStorage(); 
                });
            }

            folderLinksList.appendChild(listItem);
        });
    }

    document.addEventListener('click', (e) => {
        const clickedLink = e.target.closest('a[data-link-id]');
        
        if (clickedLink && folderLinksList && folderLinksList.contains(clickedLink)) {
            return; 
        }

        if (!clickedLink) return;

        const linkId = clickedLink.dataset.linkId;
        const folderId = clickedLink.dataset.folderId || null;

        allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];

        let foundLink = null;
        let foundFolder = null;

        if (folderId) {
            const folder = allBookmarks.find(f => String(f.id) === String(folderId));
            if (folder) {
                foundFolder = folder;
                foundLink = (folder.links || []).find(l => String(l.id) === String(linkId));
            }
        }

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
            return; 
        }

        addToHistory(foundLink, foundFolder ? foundFolder.id : null);

        foundLink.visits = (foundLink.visits || 0) + 1;
        foundLink.lastVisitedAt = Date.now();
        saveBookmarksToLocalStorage(); 
    });
}); 