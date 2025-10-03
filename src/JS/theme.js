import moon from "../images/moon.svg";
import sun from "../images/sun.svg";

const body = document.body;
const toggleBtn = document.querySelector(".theme-toggle");
const img = toggleBtn ? toggleBtn.querySelector("img") : null;

// 🔹 Хелпер: безопасно применяем стиль, если элемент существует
function setBackground(selector, color) {
  const el = document.querySelector(selector);
  if (el) {
    el.style.background = color;
  }
}

// 🔹 Функция: применяем тему ко всей странице
function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    body.style.background = "var(--bg-dark)";
    if (img) img.src = moon;

    setBackground(".top-header", "var(--bg-dark)");
    setBackground(".search-bar", "var(--bg-dark)");
    setBackground(".header-theme", "var(--bg-dark)");
    setBackground(".chooseLanguage", "var(--bg-dark)");
    setBackground(".folders-search-input", "var(--bg-dark)");
  } else {
    body.classList.remove("dark");
    body.style.background = "#fff";
    if (img) img.src = sun;

    setBackground(".top-header", "#fff");
    setBackground(".search-bar", "#fff");
    setBackground(".header-theme", "#fff");
    setBackground(".chooseLanguage", "#fff");
    setBackground(".folders-search-input", "#fff");
  }

  localStorage.setItem("theme", theme);
}

// 🔹 Инициализация (берём из localStorage или дефолт — светлая)
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

// 🔹 Слушатель для переключателя
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.add("rotate");
    setTimeout(() => toggleBtn.classList.remove("rotate"), 500);

    const newTheme = body.classList.contains("dark") ? "light" : "dark";
    applyTheme(newTheme);
  });
}
