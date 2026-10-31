// Manejo de sesión y menú. Se carga en el <head> de todas las páginas, con defer.
// El token se guarda en sessionStorage (se borra al cerrar la pestaña).

const CLAVE_TOKEN = "token";
let paginaProtegida = false;

// Dice si hay un token guardado
function haySesion() {
  try {
    const token = sessionStorage.getItem(CLAVE_TOKEN);
    // "undefined" y "null" son textos que quedan si se guardó un token vacío
    return Boolean(token) && token !== "undefined" && token !== "null";
  } catch {
    return false;
  }
}

// Guarda el token recibido del login
function guardarSesion(token) {
  sessionStorage.setItem(CLAVE_TOKEN, token);
}

// Borra el token y vuelve al inicio
function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_TOKEN);
  window.location.href = "index.html";
}

// Manda al login si no hay sesión (para las páginas de administración)
function protegerPagina() {
  paginaProtegida = true;
  if (!haySesion()) {
    window.location.replace("login.html");
  }
}

// Muestra u oculta las opciones del menú y del footer según haya sesión
function actualizarMenu() {
  const conSesion = haySesion();
  document.querySelectorAll('[data-sesion="con"]').forEach((el) => {
    el.classList.toggle("d-none", !conSesion);
  });
  document.querySelectorAll('[data-sesion="sin"]').forEach((el) => {
    el.classList.toggle("d-none", conSesion);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarMenu();
  document.querySelectorAll('[data-accion="cerrar-sesion"]').forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  });
});

// Si el navegador restaura la página con el botón "Atrás" (sin recargarla),
// se vuelve a revisar la sesión para no mostrar páginas de administración.
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    actualizarMenu();
    if (paginaProtegida) protegerPagina();
  }
});
