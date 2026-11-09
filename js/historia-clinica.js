// Valeria — Historia clínica

const formHistoriaClinica = document.getElementById("formHistoriaClinica");
const selectMascota = document.getElementById("selectMascota");
const selectVeterinario = document.getElementById("selectVeterinario");
const fechaHoraInput = document.getElementById("fechaHora");
const observacionesInput = document.getElementById("observaciones");
const btnGuardarHistoria = document.getElementById("btnGuardarHistoria");
const avisoSinDatos = document.getElementById("avisoSinDatos");
const cuerpoTablaHistorias = document.getElementById("cuerpoTablaHistorias");
const cantidadHistorias = document.getElementById("cantidadHistorias");
const filtroHistoriasInput = document.getElementById("filtroHistorias");
const btnLimpiarFiltro = document.getElementById("btnLimpiarFiltro");

// Devuelve la fecha y hora actual en el formato del input datetime-local.
function fechaHoraActual() {
  const ahora = new Date();
  const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

// Carga las mascotas y veterinarios guardados en los selects.
function cargarSelects() {
  const mascotas = leerDatos("mascotas");
  const veterinarios = leerDatos("veterinarios");

  selectMascota.replaceChildren();
  selectVeterinario.replaceChildren();

  const opcionMascota = document.createElement("option");
  opcionMascota.value = "";
  opcionMascota.textContent = "Seleccioná una mascota";
  selectMascota.appendChild(opcionMascota);

  mascotas.forEach(function (mascota) {
    const opcion = document.createElement("option");
    opcion.value = mascota.idMascota;
    opcion.textContent = mascota.nombreMascota;
    selectMascota.appendChild(opcion);
  });

  const opcionVeterinario = document.createElement("option");
  opcionVeterinario.value = "";
  opcionVeterinario.textContent = "Seleccioná un veterinario";
  selectVeterinario.appendChild(opcionVeterinario);

  veterinarios.forEach(function (veterinario) {
    const opcion = document.createElement("option");
    opcion.value = veterinario.idVeterinario;
    opcion.textContent = veterinario.nombre;
    selectVeterinario.appendChild(opcion);
  });

  // Si falta alguna de las dos listas, se avisa y no se permite guardar.
  const avisos = [];
  if (mascotas.length === 0) {
    avisos.push(
      "No hay mascotas registradas. Cargá al menos una mascota para poder guardar una historia clínica.",
    );
  }
  if (veterinarios.length === 0) {
    avisos.push(
      "No hay veterinarios registrados. Cargá al menos un veterinario para poder guardar una historia clínica.",
    );
  }

  const faltanDatos = avisos.length > 0;
  avisoSinDatos.textContent = avisos.join(" ");
  avisoSinDatos.classList.toggle("d-none", !faltanDatos);
  btnGuardarHistoria.disabled = faltanDatos;
  selectMascota.disabled = mascotas.length === 0;
  selectVeterinario.disabled = veterinarios.length === 0;
}

// Formatea la fecha y hora para mostrarla en la tabla.
function formatearFechaHora(valor) {
  const fecha = new Date(valor);
  if (isNaN(fecha.getTime())) return valor || "";
  return fecha.toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

// EVENTO AL ENVIAR EL FORMULARIO (SUBMIT)
formHistoriaClinica.addEventListener("submit", function (e) {
  e.preventDefault();

  const mascotas = leerDatos("mascotas");
  const veterinarios = leerDatos("veterinarios");
  const mascota = selectMascota.value;
  const veterinario = selectVeterinario.value;
  const fechaHora = fechaHoraInput.value;
  const observaciones = observacionesInput.value.trim();

  if (mascotas.length === 0 || veterinarios.length === 0) {
    alert(
      "No se puede guardar la historia clínica porque faltan mascotas o veterinarios registrados.",
    );
    return;
  }

  if (!mascota) {
    alert("Por favor, seleccioná una mascota.");
    selectMascota.focus();
    return;
  }

  if (!veterinario) {
    alert("Por favor, seleccioná un veterinario.");
    selectVeterinario.focus();
    return;
  }

  if (!fechaHora) {
    alert("Por favor, ingresá la fecha y hora de la consulta.");
    fechaHoraInput.focus();
    return;
  }

  if (!observaciones) {
    alert(
      "Las observaciones no pueden estar vacías ni contener solo espacios.",
    );
    observacionesInput.focus();
    return;
  }

  const listaHistorias = leerDatos("historiasClinicas");

  listaHistorias.push({
    idHistoriaClinica: generarId(),
    mascota,
    veterinario,
    fechaHora,
    observaciones,
  });

  guardarDatos("historiasClinicas", listaHistorias);
  limpiarFormulario();
  renderTabla();
});

// Limpia el formulario y vuelve a poner la fecha y hora actual.
function limpiarFormulario() {
  formHistoriaClinica.reset();
  fechaHoraInput.value = fechaHoraActual();
}

// Normaliza texto para comparar: minúsculas, sin acentos y sin espacios extra.
function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Devuelve true si todos los términos buscados aparecen en el texto.
function coincideConBusqueda(texto, terminos) {
  const textoNormalizado = normalizarTexto(texto);
  return terminos.every(function (termino) {
    return textoNormalizado.includes(termino);
  });
}

// Redibuja la tabla con lo que hay en LocalStorage y actualiza el contador.
function renderTabla() {
  const historias = leerDatos("historiasClinicas");
  const mascotas = leerDatos("mascotas");
  const veterinarios = leerDatos("veterinarios");

  const terminos = normalizarTexto(filtroHistoriasInput.value)
    .split(/\s+/)
    .filter(Boolean);

  // Se resuelven las referencias una sola vez y se arma el texto buscable.
  const filas = historias.map(function (historia) {
    const mascotaEncontrada = mascotas.find(function (mascota) {
      return mascota.idMascota === historia.mascota;
    });
    const veterinarioEncontrado = veterinarios.find(function (veterinario) {
      return veterinario.idVeterinario === historia.veterinario;
    });

    const nombreMascota = mascotaEncontrada
      ? mascotaEncontrada.nombreMascota
      : "Eliminado";
    const nombreDuenio = mascotaEncontrada ? mascotaEncontrada.nombreDuenio : "";
    const nombreVeterinario = veterinarioEncontrado
      ? veterinarioEncontrado.nombre
      : "Eliminado";

    return {
      historia,
      nombreMascota,
      nombreVeterinario,
      textoBusqueda: [
        formatearFechaHora(historia.fechaHora),
        historia.fechaHora,
        nombreMascota,
        nombreDuenio,
        nombreVeterinario,
        historia.observaciones,
      ].join(" "),
    };
  });

  const filasFiltradas =
    terminos.length === 0
      ? filas
      : filas.filter(function (fila) {
          return coincideConBusqueda(fila.textoBusqueda, terminos);
        });

  // La más nueva primero.
  filasFiltradas.sort(function (a, b) {
    const fechaA = new Date(a.historia.fechaHora).getTime() || 0;
    const fechaB = new Date(b.historia.fechaHora).getTime() || 0;
    return fechaB - fechaA;
  });

  cantidadHistorias.textContent =
    terminos.length === 0
      ? historias.length
      : `${filasFiltradas.length} de ${historias.length}`;

  cuerpoTablaHistorias.replaceChildren();

  if (filasFiltradas.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 4;
    celda.className = "text-center text-muted py-4";
    celda.textContent =
      historias.length === 0
        ? "Todavía no hay historias clínicas registradas."
        : "No se encontraron historias clínicas para esa búsqueda.";
    fila.appendChild(celda);
    cuerpoTablaHistorias.appendChild(fila);
    return;
  }

  filasFiltradas.forEach(function (fila) {
    const tr = document.createElement("tr");

    [
      formatearFechaHora(fila.historia.fechaHora),
      fila.nombreMascota,
      fila.nombreVeterinario,
    ].forEach(function (dato) {
      const celda = document.createElement("td");
      celda.textContent = dato;
      tr.appendChild(celda);
    });

    const celdaObservaciones = document.createElement("td");
    celdaObservaciones.textContent = fila.historia.observaciones;
    celdaObservaciones.style.whiteSpace = "pre-wrap";
    celdaObservaciones.style.wordBreak = "break-word";
    tr.appendChild(celdaObservaciones);

    cuerpoTablaHistorias.appendChild(tr);
  });
}

// Filtrado en vivo de la tabla.
filtroHistoriasInput.addEventListener("input", function () {
  btnLimpiarFiltro.classList.toggle(
    "d-none",
    filtroHistoriasInput.value.trim() === "",
  );
  renderTabla();
});

btnLimpiarFiltro.addEventListener("click", function () {
  filtroHistoriasInput.value = "";
  btnLimpiarFiltro.classList.add("d-none");
  filtroHistoriasInput.focus();
  renderTabla();
});

// Al cargar la página se muestra lo que ya está guardado.
document.addEventListener("DOMContentLoaded", function () {
  fechaHoraInput.value = fechaHoraActual();
  cargarSelects();
  renderTabla();
});
