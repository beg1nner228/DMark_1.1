import { closeModal } from "./bookmarks/modals";
import folderIMG from '../images/folder.svg'; // Default folder icon
import defaultBookmarkFavicon from '../images/dashboard-test.svg'; // Default favicon for links in preview
import { nanoid } from 'nanoid';

export const savedData = localStorage.getItem('dashMarkBookmarks');

document.addEventListener('DOMContentLoaded', () => {
    const createFolderForm = document.querySelector('.new-folder-form');
    // ИСПРАВЛЕНО: Теперь bookmarkContainer ссылается на .folders-grid
    const bookmarkContainer = document.querySelector('.folders-grid');
    const resetBookmarksBtn = document.querySelector('.reset-bookmarksBtnJS');
    const createBookmarkTitle = document.querySelector('.BookmarkTitleJS');
    const foldersSearchInput = document.querySelector('.foldersSearchJS');

    if (!createFolderForm) {
        console.error('Form .new-folder-form not found in DOM — check your HTML or script loading order.');
        // return; // Оставляем, чтобы другие части скрипта могли работать, если форма необязательна
    }
    if (!bookmarkContainer) {
        console.error('Bookmark container .folders-grid not found.');
        return; // Если контейнер не найден, то нет смысла продолжать рендеринг
    }

    // load stored data
    const savedData = localStorage.getItem('dashMarkBookmarks');
    let allBookmarks = savedData ? JSON.parse(savedData) : [];

    // Reset button functionality
    if (resetBookmarksBtn) { // Добавлена проверка
        resetBookmarksBtn.addEventListener("click", (e) => {
            const imgElement = e.target.closest('.resetBtn')?.querySelector('.resetImg'); // Находим img внутри кнопки
            if (imgElement) {
                imgElement.classList.add("reset_animation");
            }

            const deleteData = confirm("Are you sure you want to delete all bookmarks?");
            const animationDuration = 1100;

            if (deleteData) {
                setTimeout(() => {
                    if (imgElement) {
                        imgElement.classList.remove("reset_animation");
                    }
                    localStorage.removeItem("dashMarkBookmarks");
                    location.reload(true);
                }, animationDuration);
            } else {
                alert("Your data is accessible, we have not deleted anything.");
                if (imgElement) {
                    imgElement.classList.remove("reset_animation");
                }
            }
        });
    }


    // Helper to create individual link HTML (not used in folder-card preview)
    function createLinkHTML({ title, url }) {
        return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`;
    }

    // Function to create folder card HTML for "All Bookmarks" page
    function createFolderCardHTML(folderData) {
        const folderColor = getRandomColor();
        const previewLinks = (folderData.links || [])
            .slice(0, 3)
            .map(link => {
                const faviconUrl = getFaviconUrl(link.url);
                return `
                    <a href="${escapeHtml(link.url)}"
                       target="_blank"
                       rel="noopener noreferrer"
                       data-link-id="${escapeHtml(link.id)}"
                       data-folder-id="${escapeHtml(folderData.id)}"> <img src="${escapeHtml(faviconUrl)}" alt="${escapeHtml(link.title)}" />
                    </a>
                `;
            })
            .join('');

        const remainingLinksCount = Math.max(0, (folderData.links || []).length - 3);

        return `
            <div class="folder-card" data-folder-id="${escapeHtml(folderData.id)}" data-folder-name="${escapeHtml(folderData.name)}" style="--folder-color: ${folderColor};">
                <div class="folder-header">
                    <img src="${escapeHtml(folderData.icon || folderIMG)}" alt="folder icon" class="folder-icon"/>
                    <span class="folder-name">${escapeHtml(folderData.name)}</span>
                </div>
                <div class="folder-preview-icons">
                    ${previewLinks}
                    ${remainingLinksCount > 0 ? `<span class="more-links">+${remainingLinksCount}</span>` : ''}
                </div>
            </div>
        `;
    }


    // Function to get favicon URL (for preview icons)
    function getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`;
        } catch (e) {
            return defaultBookmarkFavicon; // Fallback to a local default image
        }
    }

    // Function to generate a random color for folder-card top border
    function getRandomColor() {
        const colors = [
            'var(--accent-purple)',
            'var(--accent-orange)',
            'var(--accent-blue)',
            'var(--accent-green)',
            'var(--accent-red)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }


    // Render all bookmarks (folders)
    function renderAllBookmarks(filter = '') {
        if (!bookmarkContainer) return;

        allBookmarks = JSON.parse(localStorage.getItem('dashMarkBookmarks')) || []; // Обновляем данные

        const filteredBookmarks = allBookmarks.filter(folder =>
            folder.name.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredBookmarks.length === 0) {
            if (createBookmarkTitle) createBookmarkTitle.classList.remove('unvisible');
            bookmarkContainer.innerHTML = '';
        } else {
            if (createBookmarkTitle) createBookmarkTitle.classList.add('unvisible');
            const allFoldersHTML = filteredBookmarks.map(createFolderCardHTML).join('');
            bookmarkContainer.innerHTML = allFoldersHTML;
        }
    }

    function saveBookmarksToLocalStorage() {
        localStorage.setItem('dashMarkBookmarks', JSON.stringify(allBookmarks));
    }

    // utility: escape html to avoid XSS (дублируется, лучше вынести)
    function escapeHtml(str = '') {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    // helper to convert File -> dataURL
    function fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Debug: quick view of form inputs (on open you can call this)
    function dumpFormElements() {
        if (!createFolderForm) return; // Проверка
        const els = [...createFolderForm.elements].map(el => ({
            tag: el.tagName,
            type: el.type,
            name: el.name,
            value: el.value,
            disabled: el.disabled
        }));
        console.log('Form elements snapshot:', els);
    }

    // main submit handler
    if (createFolderForm) { // Проверка
        createFolderForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fd = new FormData(createFolderForm);

            const folderNameRaw = fd.get('folderName');
            const bookmarkURLRaw = fd.get('bookmarkURL');
            const bookmarkTitleRaw = fd.get('bookmarkTitle');
            const folderIconFile = fd.get('folderIcon'); // File or null

            const folderName = (folderNameRaw && folderNameRaw.toString().trim()) || '';
            const bookmarkURL = (bookmarkURLRaw && bookmarkURLRaw.toString().trim()) || '';
            const bookmarkTitle = (bookmarkTitleRaw && bookmarkTitleRaw.toString().trim()) || bookmarkURL;

            // Basic validation
            if (!folderName) {
                console.warn('Folder name is empty — please fill it');
                return;
            }
            if (!bookmarkURL) {
                console.warn('Bookmark URL is empty — please fill it');
                alert('Введите URL ссылки');
                return;
            }
            try {
                // validate URL
                new URL(bookmarkURL);
            } catch (err) {
                alert('Некорректный URL');
                return;
            }

            // If a file was chosen and has size > 0, convert to base64
            let iconData = folderIMG; // Default icon
            if (folderIconFile && folderIconFile instanceof File && folderIconFile.size > 0) {
                try {
                    iconData = await fileToDataURL(folderIconFile);
                } catch (err) {
                    console.warn('Error reading icon file, using default icon', err);
                }
            }

            const newLink = { title: bookmarkTitle, url: bookmarkURL, id: nanoid() }; // Добавлен ID для ссылки

            const existingFolderIndex = allBookmarks.findIndex(f => f.name.toLowerCase() === folderName.toLowerCase());
            if (existingFolderIndex !== -1) {
                // Add link to existing folder
                allBookmarks[existingFolderIndex].links.push(newLink);
            } else {
                // Create new folder
                const newFolder = { name: folderName, icon: iconData, links: [newLink], id: nanoid() }; // Добавлен ID для папки
                allBookmarks.push(newFolder);
            }

            saveBookmarksToLocalStorage();
            renderAllBookmarks(); // Re-render with new data
            createFolderForm.reset();
            closeModal(); // Закрытие основной модалки создания
        });
    } else {
        console.warn('Create folder form .new-folder-form not found. Submission will not work.');
    }


    // Search functionality for folders
    if (foldersSearchInput) { // Проверка
        foldersSearchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            renderAllBookmarks(searchTerm);
        });
    }

    // initial render
    renderAllBookmarks();

    // Check if there are no bookmarks and show the placeholder
    if (allBookmarks.length === 0) {
        if (createBookmarkTitle) createBookmarkTitle.classList.remove('unvisible');
    } else {
        if (createBookmarkTitle) createBookmarkTitle.classList.add('unvisible');
    }

    // expose debug function to console if needed
    window._dumpFolderForm = dumpFormElements;
    window.renderAllBookmarks = renderAllBookmarks; // Теперь это глобальная функция
    
    // Слушатель для обновления закладок при внешних изменениях
    window.addEventListener('bookmarksUpdated', () => {
        renderAllBookmarks();
    });
});