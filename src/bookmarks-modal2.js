import './JS/i18n.js';
import './css/reset.css';
import './css/bookmarks.css'
import './css/container.css';
import './JS/theme.js';
import './JS/bookmarks/modals.js';
import './JS/render-bookmarks.js';
import './JS/bookmarks/header.js';
import "./css/folder-details-modal.css";
import "./JS/folder-details-modal.js";
import './css/history&settings_modals.css';
import "./JS/history.js";

const data = localStorage.getItem("dashMarkBookmarks");
const firstBookmark = document.querySelector(".BookmarkTitleJS");

if (data) { 

    try {
        const parsedData = JSON.parse(data);
        
        if (parsedData.length > 0) {
            firstBookmark.classList.add("unvisible");
        }
    } catch (e) {
        console.error("Error parsing dashMarkBookmarks from localStorage:", e);
    }
} else {
    console.log("No bookmarks found in localStorage.");
}
console.clear();