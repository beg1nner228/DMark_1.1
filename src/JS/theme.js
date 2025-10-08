import moon from "../images/moon.svg";
import sun from "../images/sun.svg";

const body = document.body;
const toggleBtn = document.querySelector(".theme-toggle");
const img = toggleBtn?.querySelector("img");

const themeSelect = document.getElementById('theme');

const THEME_STORAGE_KEY = 'userThemePreference'; 

/**
 * @param {string} theme 
 * @param {boolean} [saveToStorage=true] 
 */
export function applyAndSaveTheme(theme, saveToStorage = true) {
    document.body.classList.remove('force-light-theme', 'force-dark-theme');

    let actualTheme = theme;
    if (theme === 'system') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (actualTheme === "dark") {
        body.classList.add("force-dark-theme");
        if (img) img.src = moon;
    } else { 
        body.classList.remove("force-dark-theme");
        if (img) img.src = sun;
    }

    if (themeSelect) {
        themeSelect.value = theme;
    }

    if (saveToStorage) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'system';
applyAndSaveTheme(savedTheme, false); 

toggleBtn?.addEventListener("click", () => {
    toggleBtn.classList.add("rotate");
    setTimeout(() => toggleBtn.classList.remove("rotate"), 500);

    let currentPreference = localStorage.getItem(THEME_STORAGE_KEY);
    let newTheme;
    if (currentPreference === 'dark' || (currentPreference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        newTheme = 'light';
    } else {
        newTheme = 'dark';
    }

    applyAndSaveTheme(newTheme);
});

themeSelect?.addEventListener('change', function() {
    const selectedTheme = this.value;
    applyAndSaveTheme(selectedTheme);
});