const nav = document.querySelector("nav");
const ul = document.querySelector("ul");
const flechaAbajo = document.querySelector(".flecha-abajo");
const flechaArriba = document.querySelector(".flecha-arriba");
const navButton = document.querySelector(".nav-button");
const aElementos = document.querySelectorAll("a");

navButton.addEventListener("click", () => {
  nav.classList.toggle("desplazamiento");
  ul.classList.toggle("invisible");
  flechaAbajo.classList.toggle("invisible");
  flechaArriba.classList.toggle("invisible");
});

aElementos.forEach((a) => {
  a.addEventListener("click", () => {
    if (nav.classList.contains("desplazamiento")) {
      nav.classList.remove("desplazamiento");
      ul.classList.add("invisible");
    }
  });
});

function actualizarClase() {
  if (window.innerWidth >= 1024) {
    ul.classList.remove("invisible");
    nav.classList.remove("desplazamiento");
    flechaAbajo.classList.remove("invisible")
    flechaArriba.classList.add("invisible")
  } else {
    if (!nav.classList.contains("desplazamiento")) {
      ul.classList.add("invisible");
    }
  }
}

window.addEventListener("resize", actualizarClase);

actualizarClase();
