const openBtn = document.querySelector(".addNewFolder")
console.log(openBtn)
const closeBtn = document.querySelector(".closeBtn")
const backdrop = document.querySelector(".js-backdrop")

const onOpenModal = (event) => {
  document.body.classList.add("show-modal")
  document.addEventListener("keydown", onEscapeCloseModal)
}

const onCloseModal = (event) => {
  document.body.classList.remove("show-modal")
  document.removeEventListener("keydown", onEscapeCloseModal)
}

// function to close the modal after use

export const closeModal = () => {
  document.body.classList.remove("show-modal")
  document.removeEventListener("keydown", onEscapeCloseModal)
}

const onBackdropClick = (event) => {
  if(event.target === event.currentTarget) {
    onCloseModal();
  }
}
// escape
const onEscapeCloseModal = (event) => {
  if(event.code === "Escape") {
    onCloseModal();
  }
}

openBtn.addEventListener("click", onOpenModal)
closeBtn.addEventListener("click", onCloseModal)
backdrop.addEventListener("click", onBackdropClick)