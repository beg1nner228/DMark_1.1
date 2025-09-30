import './css/reset.css';
import './css/style.css';
import './css/bookmarks.css'
import './css/container.css';
import './JS/theme.js';
import './JS/bookmarks/modals.js'
import './JS/bookmarks/create.js'
import './JS/render-bookmarks.js'

const arr = localStorage.getItem("dashMarkBookmarks")
const firstBookmark = document.querySelector(".BookmarkTitleJS");

if(arr.length > 0) {
  firstBookmark.classList.add("unvisible");
}


