// Ariel — Turnos
// Ariel — alta, listado y cancelación de turnos.

const formularioTurno = document.getElementById("formTurno");
const selectorMascota = document.getElementById("mascota");
const selectorVeterinario = document.getElementById("veterinario");
const fechaHoraInput = document.getElementById("fechaHora");
const costoConsultaOutput = document.getElementById("costoConsulta");
const botonGuardarTurno = document.getElementById("btnGuardarTurno");
const avisoCatalogos = document.getElementById("avisoCatalogos");
const cuerpoTablaTurnos = document.getElementById("cuerpoTablaTurnos");
const cantidadTurnos = document.getElementById("cantidadTurnos");

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

function leerMascotas() {
  return leerDatos("mascotas");
}

function leerVeterinarios() {
  return leerDatos("veterinarios");
}

function fechaLocalParaInput(fecha) {
  const desfase = fecha.getTimezoneOffset() * 60_000;
  return new Date(fecha.getTime() - desfase).toISOString().slice(0, 16);
}

function actualizarFechaMinima() {
  const minimo = new Date(Date.now() + 60_000);
  minimo.setSeconds(0, 0);
  fechaHoraInput.min = fechaLocalParaInput(minimo);
}

function llenarOpciones(select, opciones, textoInicial, idCampo, textoOpcion) {
  select.replaceChildren();

  const inicial = document.createElement("option");
  inicial.value = "";
  inicial.textContent = textoInicial;
  select.appendChild(inicial);

  opciones.forEach((opcion) => {
    const elemento = document.createElement("option");
    elemento.value = opcion[idCampo];
    elemento.textContent = textoOpcion(opcion);
    select.appendChild(elemento);
  });
}

function actualizarCatalogos() {
  const mascotas = leerMascotas();
  const veterinarios = leerVeterinarios();

  llenarOpciones(
    selectorMascota,
    mascotas,
    "Seleccioná una mascota",
    "idMascota",
    (mascota) => mascota.nombreMascota,
  );

  llenarOpciones(
    selectorVeterinario,
    veterinarios,
    "Seleccioná un veterinario",
    "idVeterinario",
    (veterinario) =>
      `${veterinario.nombre} — ${veterinario.especializacion}`,
  );

  selectorMascota.disabled = mascotas.length === 0;
  selectorVeterinario.disabled = veterinarios.length === 0;
  botonGuardarTurno.disabled =
    mascotas.length === 0 || veterinarios.length === 0;

  const faltantes = [];
  if (mascotas.length === 0) {
    faltantes.push("no hay mascotas registradas");
  }
  if (veterinarios.length === 0) {
    faltantes.push("no hay veterinarios registrados");
  }

  avisoCatalogos.classList.toggle("d-none", faltantes.length === 0);

  if (faltantes.length > 0) {
    avisoCatalogos.textContent =
      `No se puede agendar un turno porque ${faltantes.join(" y ")}. ` +
      "Cargá esos datos antes de continuar.";
  }
}

function actualizarCostoConsulta() {
  const veterinario = leerVeterinarios().find(
    (item) => item.idVeterinario === selectorVeterinario.value,
  );

  costoConsultaOutput.textContent = veterinario
    ? formatoMoneda.format(Number(veterinario.valorConsulta))
    : "Seleccioná un veterinario";
}

function formatearFechaHora(valor) {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Eliminado";

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(fecha);
}

function agregarCelda(fila, texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  fila.appendChild(celda);
  return celda;
}

function renderTablaTurnos() {
  const turnos = leerDatos("turnos").slice().sort((a, b) => {
    return new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime();
  });

  const mascotas = leerMascotas();
  const veterinarios = leerVeterinarios();

  cuerpoTablaTurnos.replaceChildren();
  cantidadTurnos.textContent = turnos.length;

  if (turnos.length === 0) {
    const fila = document.createElement("tr");
    const celda = agregarCelda(fila, "Todavía no hay turnos agendados.");
    celda.colSpan = 5;
    celda.className = "text-center text-muted py-4";
    cuerpoTablaTurnos.appendChild(fila);
    return;
  }

  turnos.forEach((turno) => {
    const fila = document.createElement("tr");

    const mascota = mascotas.find(
      (item) => item.idMascota === turno.mascota,
    );
    const veterinario = veterinarios.find(
      (item) => item.idVeterinario === turno.veterinario,
    );

    agregarCelda(fila, formatearFechaHora(turno.fechaHora));
    agregarCelda(fila, mascota ? mascota.nombreMascota : "Eliminado");
    agregarCelda(fila, veterinario ? veterinario.nombre : "Eliminado");
    agregarCelda(
      fila,
      veterinario
        ? formatoMoneda.format(Number(veterinario.valorConsulta))
        : "Eliminado",
    );

    const celdaAcciones = document.createElement("td");
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-sm btn-outline-danger";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () =>
      eliminarTurno(turno.idTurno),
    );

    celdaAcciones.appendChild(botonEliminar);
    fila.appendChild(celdaAcciones);
    cuerpoTablaTurnos.appendChild(fila);
  });
}

function eliminarTurno(idTurno) {
  const confirmar = window.confirm(
    "¿Confirmás que querés eliminar este turno?",
  );
  if (!confirmar) return;

  const turnosActualizados = leerDatos("turnos").filter(
    (turno) => turno.idTurno !== idTurno,
  );

  guardarDatos("turnos", turnosActualizados);
  renderTablaTurnos();
}

formularioTurno.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const mascotas = leerMascotas();
  const veterinarios = leerVeterinarios();

  if (mascotas.length === 0 || veterinarios.length === 0) {
    actualizarCatalogos();
    return;
  }

  const idMascota = selectorMascota.value;
  const idVeterinario = selectorVeterinario.value;
  const fechaHora = fechaHoraInput.value;
  const fechaElegida = new Date(fechaHora);

  if (!idMascota || !idVeterinario || !fechaHora) {
    window.alert("Completá todos los campos para agendar el turno.");
    return;
  }

  if (!mascotas.some((mascota) => mascota.idMascota === idMascota)) {
    window.alert("La mascota seleccionada ya no está registrada.");
    actualizarCatalogos();
    return;
  }

  if (!veterinarios.some((vet) => vet.idVeterinario === idVeterinario)) {
    window.alert("El veterinario seleccionado ya no está registrado.");
    actualizarCatalogos();
    return;
  }

  if (
    Number.isNaN(fechaElegida.getTime()) ||
    fechaElegida.getTime() <= Date.now()
  ) {
    window.alert("Elegí una fecha y hora futuras.");
    actualizarFechaMinima();
    fechaHoraInput.focus();
    return;
  }

  const turnos = leerDatos("turnos");
  const horarioOcupado = turnos.some(
    (turno) =>
      turno.veterinario === idVeterinario &&
      turno.fechaHora === fechaHora,
  );

  if (horarioOcupado) {
    window.alert("Ese veterinario ya tiene un turno en esa fecha y hora.");
    return;
  }

  turnos.push({
    idTurno: generarId(),
    fechaHora,
    mascota: idMascota,
    veterinario: idVeterinario,
  });

  guardarDatos("turnos", turnos);
  formularioTurno.reset();
  actualizarFechaMinima();
  actualizarCostoConsulta();
  renderTablaTurnos();
});

selectorVeterinario.addEventListener("change", actualizarCostoConsulta);

actualizarCatalogos();
actualizarFechaMinima();
actualizarCostoConsulta();
renderTablaTurnos();