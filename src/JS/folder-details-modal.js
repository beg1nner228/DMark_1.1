import { closeModal as closeMainModal } from "./bookmarks/modals"; // Для закрытия основной модалки
import folderIMG from '../images/folder.svg'; // Дефолтная иконка папки
import defaultBookmarkFavicon from '../images/dashboard-test.svg'; // Дефолтный фавикон ссылки

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    const folderDetailsBackdrop = document.querySelector('.js-folder-details-backdrop');
    const folderDetailsModal = document.querySelector('.folder-details-modal');
    const folderDetailsTitle = document.querySelector('.folder-details-title');
    const folderNameEditInput = document.querySelector('.folder-name-edit-input');
    const folderLinksList = document.querySelector('.folder-links-list');
    const deleteFolderBtn = document.querySelector('.delete-folder-btn');
    const saveFolderNameBtn = document.querySelector('.save-folder-name-btn');
    const closeDetailsModalBtn = document.querySelector('.close-details-modal-btn');

    let currentFolderIndex = -1; // Индекс текущей открытой папки
    let allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];

    // Utility to get favicon URL (same as in render-bookmarks.js)
    function getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`;
        } catch (e) {
            return defaultBookmarkFavicon;
        }
    }

    // Utility: escape html to avoid XSS (same as in render-bookmarks.js)
    function escapeHtml(str = '') {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    // Render links inside the folder details modal
    function renderFolderLinks(folder) {
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
                    <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="link-title">${escapeHtml(link.title)}</a>
                </div>
                <div class="link-actions">
                    <button class="edit-link-btn" data-link-index="${linkIndex}" title="Edit Link">
                        <img src="./src/images/edit.svg" alt="Edit" width="18" height="18">
                    </button>
                    <button class="delete-link-btn" data-link-index="${linkIndex}" title="Delete Link">
                        <img src="./src/images/delete.svg" alt="Delete" width="18" height="18">
                    </button>
                </div>
            `;
            folderLinksList.appendChild(listItem);
        });
    }

    // Open folder details modal
    function openFolderDetailsModal(folderName) {
        allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];
        currentFolderIndex = allBookmarks.findIndex(f => f.name.toLowerCase() === folderName.toLowerCase());

        if (currentFolderIndex === -1) {
            console.error(`Folder "${folderName}" not found.`);
            return;
        }

        const folder = allBookmarks[currentFolderIndex];
        folderDetailsTitle.textContent = escapeHtml(folder.name);
        folderNameEditInput.value = escapeHtml(folder.name);
        renderFolderLinks(folder);

        folderDetailsBackdrop.classList.add('is-open');
        mainContent.classList.add('has-modal-open'); // Добавляем класс для затемнения основного контента
    }

    // Close folder details modal
    function closeFolderDetailsModal() {
        folderDetailsBackdrop.classList.remove('is-open');
        mainContent.classList.remove('has-modal-open'); // Удаляем класс
        currentFolderIndex = -1;
        // Перезагружаем все закладки на главной странице, чтобы обновить их
        window.dispatchEvent(new Event('bookmarksUpdated'));
    }

    // Event listener for opening folder details
    document.querySelector('.folders-grid').addEventListener('click', (event) => {
        const folderCard = event.target.closest('.folder-card');
        if (folderCard) {
            const folderName = folderCard.dataset.folderName;
            openFolderDetailsModal(folderName);
        }
    });

    // Close modal button
    closeDetailsModalBtn.addEventListener('click', closeFolderDetailsModal);

    // Close modal on backdrop click
    folderDetailsBackdrop.addEventListener('click', (event) => {
        if (event.target === folderDetailsBackdrop) {
            closeFolderDetailsModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && folderDetailsBackdrop.classList.contains('is-open')) {
            closeFolderDetailsModal();
        }
    });

    // Delete Folder button handler
    deleteFolderBtn.addEventListener('click', () => {
        if (currentFolderIndex === -1) return;

        const folder = allBookmarks[currentFolderIndex];
        if (confirm(`Are you sure you want to delete the folder "${folder.name}" and all its links?`)) {
            allBookmarks.splice(currentFolderIndex, 1);
            localStorage.setItem('dashMarkBookmarks', JSON.stringify(allBookmarks));
            closeFolderDetailsModal();
        }
    });

    // Save Folder Name button handler
    saveFolderNameBtn.addEventListener('click', () => {
        if (currentFolderIndex === -1) return;

        const oldName = allBookmarks[currentFolderIndex].name;
        const newName = folderNameEditInput.value.trim();

        if (!newName) {
            alert('Folder name cannot be empty.');
            return;
        }

        if (newName.toLowerCase() === oldName.toLowerCase()) {
            alert('Folder name is the same.');
            return;
        }

        // Check for duplicate folder names (case-insensitive)
        const isDuplicate = allBookmarks.some((folder, index) =>
            index !== currentFolderIndex && folder.name.toLowerCase() === newName.toLowerCase()
        );

        if (isDuplicate) {
            alert('A folder with this name already exists. Please choose a different name.');
            return;
        }

        allBookmarks[currentFolderIndex].name = newName;
        localStorage.setItem('dashMarkBookmarks', JSON.stringify(allBookmarks));
        folderDetailsTitle.textContent = escapeHtml(newName); // Update modal title
        alert('Folder name updated successfully!');
        // No need to close modal, just re-render links if necessary (not in this case, only name changed)
        // We'll dispatch an event to trigger re-render on the main page.
        window.dispatchEvent(new Event('bookmarksUpdated'));
    });

    // Event delegation for link actions (delete/edit)
    folderLinksList.addEventListener('click', (event) => {
        const target = event.target;
        const deleteBtn = target.closest('.delete-link-btn');
        const editBtn = target.closest('.edit-link-btn');

        if (deleteBtn) {
            const linkIndex = parseInt(deleteBtn.dataset.linkIndex);
            if (currentFolderIndex !== -1 && !isNaN(linkIndex)) {
                const folder = allBookmarks[currentFolderIndex];
                const linkTitle = folder.links[linkIndex].title;
                if (confirm(`Are you sure you want to delete the link "${linkTitle}"?`)) {
                    folder.links.splice(linkIndex, 1);
                    localStorage.setItem('dashMarkBookmarks', JSON.stringify(allBookmarks));
                    renderFolderLinks(folder); // Re-render links in the modal
                    // No need to close modal
                }
            }
        } else if (editBtn) {
            // TODO: Implement link editing. This could open another small modal or inline edit.
            // For now, let's just log it.
            const linkIndex = parseInt(editBtn.dataset.linkIndex);
            if (currentFolderIndex !== -1 && !isNaN(linkIndex)) {
                const folder = allBookmarks[currentFolderIndex];
                const linkToEdit = folder.links[linkIndex];
                alert(`Editing link: ${linkToEdit.title}\nURL: ${linkToEdit.url}`);
                // Here you would typically open an edit form for the link
            }
        }
    });

    // Listen for updates from other scripts (e.g., from render-bookmarks.js after new bookmark is added)
    window.addEventListener('bookmarksUpdated', () => {
        allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || [];
        // Optionally re-render the main bookmarks grid if it's visible
        // You might need to expose renderAllBookmarks globally or pass it
        if (window.renderAllBookmarks) {
             window.renderAllBookmarks(); // Assuming renderAllBookmarks is exposed globally
        } else {
             // Fallback for current page if window.renderAllBookmarks is not available
             // (e.g., if render-bookmarks.js is for this page only)
             document.querySelector('.folders-grid').innerHTML = ''; // Clear for now
             const event = new Event('DOMContentLoaded'); // Trigger re-render in render-bookmarks.js
             document.dispatchEvent(event);
        }

        // If folder details modal is open, re-render its content as well
        if (folderDetailsBackdrop.classList.contains('is-open') && currentFolderIndex !== -1) {
            renderFolderLinks(allBookmarks[currentFolderIndex]);
        }
    });
});