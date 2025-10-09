import './JS/theme.js';
import './JS/i18n.js';
import './css/reset.css';
import './css/common.css';
import './css/beta_2.0.0.css'
import './css/container.css';
import './css/history&settings_modals.css';
import './JS/bookmarks/header.js';
import './JS/recently-used-slider.js'
import './JS/history.js';
import './JS/recent-links.js';
import './JS/settings.js';


export function applyAndSaveTheme(theme, saveToStorage = true) {
    document.body.classList.remove('force-light-theme', 'force-dark-theme'); // Это может вызвать мигание!
    // ...
    if (actualTheme === "dark") {
        body.classList.add("force-dark-theme");
        if (img) img.src = moon;
    } else {
        body.classList.remove("force-dark-theme"); // Здесь body.classList.remove("force-dark-theme");
        if (img) img.src = sun;
    }
    // ...
}

