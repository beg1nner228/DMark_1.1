import './JS/i18n.js';
import './css/reset.css';
import './css/style.css';
import './css/languages.css';
import './css/bookmarks.css'
import './css/container.css';
import './JS/theme.js';
import './JS/bookmarks/modals.js'
import './JS/render-bookmarks.js'
import './JS/bookmarks/header.js';


const data = localStorage.getItem("dashMarkBookmarks");
const firstBookmark = document.querySelector(".BookmarkTitleJS");

// 1. Проверяем, что data НЕ равно null
if (data) { 
    // 2. Парсим данные, чтобы получить длину массива (или строки, если это строка)
    try {
        const parsedData = JSON.parse(data);
        
        // 3. Проверяем длину (если data - это JSON-массив или строка)
        if (parsedData.length > 0) {
            firstBookmark.classList.add("unvisible");
        }
    } catch (e) {
        console.error("Error parsing dashMarkBookmarks from localStorage:", e);
        // Дополнительный код обработки ошибки парсинга, если ключ существует, но данные повреждены
    }
} else {
    // Опционально: Код, который выполняется, если данных нет (например, показать стартовое сообщение)
    console.log("No bookmarks found in localStorage.");
}

