import moon from "../images/moon.svg";
import sun from "../images/sun.svg";


const toggleBtn = document.querySelector(".theme-toggle");
const body = document.body;
const img = toggleBtn.querySelector("img")

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  img.src = moon;
} else {
    body.classList.remove("dark");
    body.style.background = "#fff"
    document.querySelector(".top-header").style.background = "#fff";    
    document.querySelector(".search-bar").style.background = "#fff"; 
    document.querySelector(".header-theme").style.background = "#fff"; 
    document.querySelector(".chooseLanguage").style.background = "#fff";    
    document.querySelector(".folders-search-input").style.background = "#fff";    
    img.src = sun;
}

toggleBtn.addEventListener("click", () => {
  toggleBtn.classList.add("rotate");
  setTimeout(() => toggleBtn.classList.remove("rotate"), 500);

  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    body.style.background = "#fff"
    document.querySelector(".top-header").style.background = "#fff";
    img.src = sun;
    document.querySelector(".top-header").style.background = "#fff";    
    document.querySelector(".search-bar").style.background = "#fff"; 
    document.querySelector(".header-theme").style.background = "#fff"; 
    document.querySelector(".chooseLanguage").style.background = "#fff";    
    document.querySelector(".folders-search-input").style.background = "#fff";  
    localStorage.setItem("theme", "light");
  } else {
    body.classList.add("dark");
    body.style.background = "var(--bg-dark)";
    img.src = moon; 
    document.querySelector(".top-header").style.background = "var(--bg-dark)"; 
    document.querySelector(".search-bar").style.background = "var(--bg-dark)"; 
    document.querySelector(".header-theme").style.background = "var(--bg-dark)";
    document.querySelector(".chooseLanguage").style.background ="var(--bg-dark)"; 
    document.querySelector(".folders-search-input").style.background = "var(--bg-dark)"; 
    localStorage.setItem("theme", "dark");
  }
});