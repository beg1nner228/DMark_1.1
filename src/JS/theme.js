import moon from "../images/moon.svg";
import sun from "../images/sun.svg";


const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;
const icon = toggleBtn.querySelector(".icon");
const img = icon.querySelector("img")

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  img.src = moon;
}

toggleBtn.addEventListener("click", () => {
  toggleBtn.classList.add("rotate");
  setTimeout(() => toggleBtn.classList.remove("rotate"), 500);

  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    img.src = sun;
    localStorage.setItem("theme", "light");
  } else {
    body.classList.add("dark");
    img.src = moon; 
    localStorage.setItem("theme", "dark");
  }
});