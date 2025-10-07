import { getRandomColor } from "./recently-used-slider";
import brainIMG from "../images/brain.svg";
import linkIMG from "../images/link-dec.svg";

const recentLinksList = document.querySelector(".bookmarks-list")
const dataLinks = JSON.parse(localStorage.getItem("dashMarkHistory"));

function mark(list) {
  const markup = list.map(li => {
    return `
        <li class="bookmark-item">
          <div class="bookmark-info">
            <div class="bookmark-color-indicator" id="${li.id}" ></div>
            <a href="${li.url}" target="_blank"><img src="${linkIMG}" alt="Link Icon" class="bookmark-favicon" /></a>
            <a href="${li.url}" target="_blank"><span class="bookmark-title">${li.title}</span></a>
          </div>
          <div class="bookmark-actions">
            <img src="${brainIMG}" alt="External Link" class="action-icon" />
          </div>
        </li>    
    ` 
  }).join(" ");

  recentLinksList.innerHTML = markup;
}

if(dataLinks.length <= 5) {
  mark(dataLinks);
} else {
  const shortData = dataLinks.slice(-5)
  mark(shortData);
}