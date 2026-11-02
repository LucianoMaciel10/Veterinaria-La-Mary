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

// Redibuja la tabla con lo que hay en LocalStorage y actualiza el contador.
function renderTabla() {
  const historias = leerDatos("historiasClinicas");
  const mascotas = leerDatos("mascotas");
  const veterinarios = leerDatos("veterinarios");

  cantidadHistorias.textContent = historias.length;
  cuerpoTablaHistorias.replaceChildren();

  if (historias.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 4;
    celda.className = "text-center text-muted py-4";
    celda.textContent = "Todavía no hay historias clínicas registradas.";
    fila.appendChild(celda);
    cuerpoTablaHistorias.appendChild(fila);
    return;
  }

  // La más nueva primero.
  const historiasOrdenadas = historias.slice().sort(function (a, b) {
    const fechaA = new Date(a.fechaHora).getTime() || 0;
    const fechaB = new Date(b.fechaHora).getTime() || 0;
    return fechaB - fechaA;
  });

  historiasOrdenadas.forEach(function (historia) {
    const fila = document.createElement("tr");

    const mascotaEncontrada = mascotas.find(function (mascota) {
      return mascota.idMascota === historia.mascota;
    });
    const veterinarioEncontrado = veterinarios.find(function (veterinario) {
      return veterinario.idVeterinario === historia.veterinario;
    });

    const datos = [
      formatearFechaHora(historia.fechaHora),
      mascotaEncontrada ? mascotaEncontrada.nombreMascota : "Eliminado",
      veterinarioEncontrado ? veterinarioEncontrado.nombre : "Eliminado",
    ];

    datos.forEach(function (dato) {
      const celda = document.createElement("td");
      celda.textContent = dato;
      fila.appendChild(celda);
    });

    const celdaObservaciones = document.createElement("td");
    celdaObservaciones.textContent = historia.observaciones;
    celdaObservaciones.style.whiteSpace = "pre-wrap";
    celdaObservaciones.style.wordBreak = "break-word";
    fila.appendChild(celdaObservaciones);

    cuerpoTablaHistorias.appendChild(fila);
  });
}

// Al cargar la página se muestra lo que ya está guardado.
document.addEventListener("DOMContentLoaded", function () {
  fechaHoraInput.value = fechaHoraActual();
  cargarSelects();
  renderTabla();
});
