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
