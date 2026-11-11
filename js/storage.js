// Funciones compartidas por todas las páginas.

// Lee un array desde LocalStorage. Si no hay nada (o está dañado), devuelve [].
function leerDatos(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

// Guarda un array completo en LocalStorage.
function guardarDatos(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

// Genera un id único para cada registro nuevo.
function generarId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

// ==========================================================================
// BÚSQUEDA EN TABLAS (compartido por todas las páginas)
// ==========================================================================

// Normaliza texto para comparar: minúsculas y sin acentos.
function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Convierte lo escrito en el buscador en una lista de palabras ya normalizadas.
function terminosDeBusqueda(texto) {
  return normalizarTexto(texto).split(/\s+/).filter(Boolean);
}

// Devuelve true si todas las palabras buscadas aparecen en el texto.
function coincideConBusqueda(texto, terminos) {
  const textoNormalizado = normalizarTexto(texto);
  return terminos.every((termino) => textoNormalizado.includes(termino));
}

// Conecta el campo de búsqueda y su botón "Limpiar" con el redibujado de la tabla.
function activarBuscador(input, botonLimpiar, redibujarTabla) {
  input.addEventListener("input", () => {
    botonLimpiar.classList.toggle("d-none", input.value.trim() === "");
    redibujarTabla();
  });

  botonLimpiar.addEventListener("click", () => {
    input.value = "";
    botonLimpiar.classList.add("d-none");
    input.focus();
    redibujarTabla();
  });
}
