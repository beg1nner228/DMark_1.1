

const slider = document.querySelector(".sliderJS");

while (slider.children.length % 3 !== 0) {
  const empty = document.createElement("div");
  empty.classList.add("slide", "empty");
  slider.appendChild(empty);
}

let slides = slider.querySelectorAll(".slide");
let index = 0;
const SLIDE_GAP = 20;
const slideWidth = slides[0].offsetWidth + SLIDE_GAP;
const buttons = document.querySelectorAll(".slider-flex-elements > button");



buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const maxIndex = slides.length - 1;

      const eventValue = e.target.dataset.value;

    if (eventValue === "next" && index < maxIndex) {
      index++;
    } else if (eventValue === "prev" && index > 0) {
      index--;
    }

    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  });
});
document.addEventListener("keydown", handleScroll)

function handleScroll(e) {
   // ArrowRight ArrowLeft
  const eventValue = e.code;

    const maxIndex = slides.length - 1;

    if (eventValue === "ArrowRight") {
      index = (index + 1) % slides.length;
    } else if (eventValue === "ArrowLeft") {
      index = (index - 1 + slides.length) % slides.length;
    }

    slider.style.transform = `translateX(-${index * slideWidth}px)`;  
}

function autoScroll() {
  setInterval(() => {
    const maxIndex = slides.length - 1;
    index = (index + 1) % slides.length;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;  
  }, 3000);
} 



autoScroll();

