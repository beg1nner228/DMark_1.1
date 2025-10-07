import moon from "../images/moon.svg";
import sun from "../images/sun.svg";

const body = document.body;
const toggleBtn = document.querySelector(".theme-toggle");
const img = toggleBtn?.querySelector("img");

// Новый элемент: select из настроек
const themeSelect = document.getElementById('theme'); // Убедитесь, что ID совпадает

// Общий ключ для localStorage
const THEME_STORAGE_KEY = 'userThemePreference'; // Используем ключ из main.js

/**
 * Применяет выбранную тему (light, dark, system) к документу и обновляет иконку.
 * @param {string} theme - 'light', 'dark' или 'system'.
 * @param {boolean} [saveToStorage=true] - Сохранять ли тему в localStorage.
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
    } else { // light or system resolves to light
        body.classList.remove("force-dark-theme");
        if (img) img.src = sun;
    }

    // Синхронизируем select в настройках, если он есть
    if (themeSelect) {
        themeSelect.value = theme;
    }

    if (saveToStorage) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
}

// При загрузке — взять сохранённую тему и применить ее
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'system';
applyAndSaveTheme(savedTheme, false); // false, чтобы не перезаписывать при загрузке

// Обработчик переключения темы (кнопка солнце/луна)
toggleBtn?.addEventListener("click", () => {
    toggleBtn.classList.add("rotate");
    setTimeout(() => toggleBtn.classList.remove("rotate"), 500);

    // Определяем новую тему для переключения (переключение между light и dark)
    // Если текущая тема 'system', переключаемся на 'dark'
    let currentPreference = localStorage.getItem(THEME_STORAGE_KEY);
    let newTheme;
    if (currentPreference === 'dark' || (currentPreference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        newTheme = 'light';
    } else {
        newTheme = 'dark';
    }

    applyAndSaveTheme(newTheme);
});

// Обработчик изменения темы через <select> в настройках
themeSelect?.addEventListener('change', function() {
    const selectedTheme = this.value;
    applyAndSaveTheme(selectedTheme);
});