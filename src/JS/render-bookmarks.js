import { closeModal } from "./bookmarks/modals";
import folderIMG from '../images/folder.svg';

document.addEventListener('DOMContentLoaded', () => {
  const createFolderForm = document.querySelector('.new-folder-form');
  const bookmarkContainer = document.querySelector('.bookmark-list');
  const resetBookmarksBtn = document.querySelector('.reset-bookmarksBtnJS')

  resetBookmarksBtn.addEventListener("click", (e) => {
      e.target.classList.add("reset_animation");

      const deleteData = 
      confirm("Are you sure you want to delete all bookmarks?");

      const animationDuration = 1100; 

      if(deleteData) {
          setTimeout(() => {
            e.target.classList.remove("reset_animation");
            localStorage.removeItem("dashMarkBookmarks");
            location.reload(true);
        }, animationDuration); 
      } else {
        alert("Your data is accessible, we have not deleted anything.")
      }
    
  });

  if (!createFolderForm) {
    console.error('Form .new-folder-form not found in DOM — check your HTML or script loading order.');
    return;
  }
  if (!bookmarkContainer) {
    console.error('Bookmark container .bookmark-list not found.');
  }

  // load stored data
  const savedData = localStorage.getItem('dashMarkBookmarks');
  let allBookmarks = savedData ? JSON.parse(savedData) : [];

  // helpers
  function createLinkHTML({ title, url }) {
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`;
  }
  function createFolderHTML(folderData) {
    const linksHTML = (folderData.links || []).map(createLinkHTML).join('');
    return `
      <li class="slide dash_slide">
        <div class="folder-card">
          <div class="folder-header">
            <img src="${folderData.icon || folderIMG}" alt="folder icon" class="folder-icon"/>
            <span class="folder-name">${escapeHtml(folderData.name)}</span>
          </div>
          <div class="folder-preview">
            ${linksHTML}
          </div>
        </div>
      </li>
    `;
  }
  function renderAllBookmarks() {
    if (!bookmarkContainer) return;
    const allFoldersHTML = allBookmarks.map(createFolderHTML).join('');
    bookmarkContainer.innerHTML = allFoldersHTML;
  }
  function saveBookmarksToLocalStorage() {
    localStorage.setItem('dashMarkBookmarks', JSON.stringify(allBookmarks));
  }

  // utility: escape html to avoid XSS
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
  createFolderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Debug: what FormData contains right now
    const fd = new FormData(createFolderForm);
    console.log('FormData entries:');
    for (const [k, v] of fd.entries()) {
      console.log(k, v);
    }

    // Read values
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
      closeModal();
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
    let iconData = folderIMG;
    if (folderIconFile && folderIconFile instanceof File && folderIconFile.size > 0) {
      try {
        iconData = await fileToDataURL(folderIconFile);
      } catch (err) {
        console.warn('Error reading icon file, using default icon', err);
      }
    }

    const newLink = { title: bookmarkTitle, url: bookmarkURL };

    const existingFolderIndex = allBookmarks.findIndex(f => f.name.toLowerCase() === folderName.toLowerCase());
    if (existingFolderIndex !== -1) {
      allBookmarks[existingFolderIndex].links.push(newLink);
    } else {
      const newFolder = { name: folderName, icon: iconData, links: [newLink] };
      allBookmarks.push(newFolder);
    }

    saveBookmarksToLocalStorage();
    renderAllBookmarks();
    createFolderForm.reset();
    closeModal();
  });

  // initial render
  renderAllBookmarks();

  // expose debug function to console if needed
  window._dumpFolderForm = dumpFormElements;
});
