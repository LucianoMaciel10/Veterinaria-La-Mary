// Valeria — Historia clínica

document.addEventListener("DOMContentLoaded", () => {
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

  // --- Helpers generales ---

  // Fecha y hora actual en el formato del input datetime-local.
  function fechaHoraActual() {
    const ahora = new Date();
    const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
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

  // --- Carga de selects ---

  function crearOpcion(valor, texto) {
    const opcion = document.createElement("option");
    opcion.value = valor;
    opcion.textContent = texto;
    return opcion;
  }

  function llenarSelect(
    select,
    elementos,
    textoInicial,
    obtenerValor,
    obtenerTexto,
  ) {
    select.replaceChildren(crearOpcion("", textoInicial));

    elementos.forEach((elemento) => {
      select.appendChild(
        crearOpcion(obtenerValor(elemento), obtenerTexto(elemento)),
      );
    });
  }

  function mostrarAviso(texto) {
    avisoSinDatos.textContent = texto;
    avisoSinDatos.classList.remove("d-none");
  }

  function ocultarAviso() {
    avisoSinDatos.textContent = "";
    avisoSinDatos.classList.add("d-none");
  }

  function actualizarEstadoFormulario(mascotas, veterinarios) {
    const faltanDatos = mascotas.length === 0 || veterinarios.length === 0;

    if (faltanDatos) {
      mostrarAviso(
        "Cargá al menos una mascota y un veterinario para poder guardar una historia clínica.",
      );
    } else {
      ocultarAviso();
    }

    btnGuardarHistoria.disabled = faltanDatos;
    selectMascota.disabled = mascotas.length === 0;
    selectVeterinario.disabled = veterinarios.length === 0;
  }

  function cargarSelects() {
    const mascotas = leerDatos("mascotas");
    const veterinarios = leerDatos("veterinarios");

    llenarSelect(
      selectMascota,
      mascotas,
      "Seleccioná una mascota",
      (mascota) => mascota.idMascota,
      (mascota) => mascota.nombreMascota,
    );

    llenarSelect(
      selectVeterinario,
      veterinarios,
      "Seleccioná un veterinario",
      (veterinario) => veterinario.idVeterinario,
      (veterinario) => veterinario.nombre,
    );

    actualizarEstadoFormulario(mascotas, veterinarios);
  }

  // --- Guardado ---

  formHistoriaClinica.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const mascota = selectMascota.value;
    const veterinario = selectVeterinario.value;
    const fechaHora = fechaHoraInput.value;
    const observaciones = observacionesInput.value.trim();

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
    formHistoriaClinica.reset();
    fechaHoraInput.value = fechaHoraActual();
    renderTabla();
  });

  // --- Buscador ---

  // Texto del buscador en minúsculas y sin espacios sobrantes.
  function obtenerTextoBusqueda() {
    return filtroHistoriasInput.value.trim().toLowerCase();
  }

  function hayFiltroActivo() {
    return obtenerTextoBusqueda() !== "";
  }

  function actualizarBotonLimpiar() {
    btnLimpiarFiltro.classList.toggle("d-none", !hayFiltroActivo());
  }

  // --- Datos de cada fila ---

  function buscarMascotaPorId(mascotas, idMascota) {
    return mascotas.find((mascota) => mascota.idMascota === idMascota);
  }

  function buscarVeterinarioPorId(veterinarios, idVeterinario) {
    return veterinarios.find(
      (veterinario) => veterinario.idVeterinario === idVeterinario,
    );
  }

  // Combina una historia con los nombres de su mascota y veterinario.
  function armarFila(historia, mascotas, veterinarios) {
    const mascota = buscarMascotaPorId(mascotas, historia.mascota);
    const veterinario = buscarVeterinarioPorId(
      veterinarios,
      historia.veterinario,
    );

    return {
      historia,
      nombreMascota: mascota ? mascota.nombreMascota : "Eliminado",
      nombreVeterinario: veterinario ? veterinario.nombre : "Eliminado",
    };
  }

  function armarFilas(historias, mascotas, veterinarios) {
    return historias.map((historia) =>
      armarFila(historia, mascotas, veterinarios),
    );
  }

  // --- Filtrado y orden ---

  function filtrarPorNombreDeMascota(filas, textoBusqueda) {
    if (!textoBusqueda) return filas;
    return filas.filter((fila) =>
      fila.nombreMascota.toLowerCase().includes(textoBusqueda),
    );
  }

  function ordenarPorFechaDescendente(filas) {
    return filas.sort(
      (a, b) =>
        new Date(b.historia.fechaHora) - new Date(a.historia.fechaHora),
    );
  }

  // --- Construcción de la tabla ---

  function crearCelda(texto, clase) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    if (clase) celda.className = clase;
    return celda;
  }

  function crearCeldaObservaciones(texto) {
    const celda = crearCelda(texto);
    celda.style.whiteSpace = "pre-wrap";
    celda.style.wordBreak = "break-word";
    return celda;
  }

  function crearFilaHistoria(fila) {
    const filaTabla = document.createElement("tr");
    filaTabla.appendChild(
      crearCelda(formatearFechaHora(fila.historia.fechaHora)),
    );
    filaTabla.appendChild(crearCelda(fila.nombreMascota));
    filaTabla.appendChild(crearCelda(fila.nombreVeterinario));
    filaTabla.appendChild(crearCeldaObservaciones(fila.historia.observaciones));
    return filaTabla;
  }

  function crearFilaVacia(hayHistorias) {
    const filaTabla = document.createElement("tr");
    const mensaje = hayHistorias
      ? "No hay historias clínicas para esa mascota."
      : "Todavía no hay historias clínicas registradas.";
    const celda = crearCelda(mensaje, "text-center text-muted py-4");
    celda.colSpan = 4;
    filaTabla.appendChild(celda);
    return filaTabla;
  }

  function actualizarContador(cantidadVisible, cantidadTotal, filtroActivo) {
    cantidadHistorias.textContent = filtroActivo
      ? `${cantidadVisible} de ${cantidadTotal}`
      : cantidadTotal;
  }

  // --- Render ---

  // Redibuja la tabla filtrando solo por el nombre de la mascota.
  function renderTabla() {
    const historias = leerDatos("historiasClinicas");
    const mascotas = leerDatos("mascotas");
    const veterinarios = leerDatos("veterinarios");

    const textoBusqueda = obtenerTextoBusqueda();
    const filtroActivo = textoBusqueda !== "";

    const filas = armarFilas(historias, mascotas, veterinarios);
    const filasFiltradas = filtrarPorNombreDeMascota(filas, textoBusqueda);
    ordenarPorFechaDescendente(filasFiltradas);

    actualizarContador(filasFiltradas.length, historias.length, filtroActivo);

    cuerpoTablaHistorias.replaceChildren();

    if (filasFiltradas.length === 0) {
      cuerpoTablaHistorias.appendChild(crearFilaVacia(historias.length > 0));
      return;
    }

    filasFiltradas.forEach((fila) => {
      cuerpoTablaHistorias.appendChild(crearFilaHistoria(fila));
    });
  }

  // --- Eventos del buscador ---

  function aplicarFiltro() {
    actualizarBotonLimpiar();
    renderTabla();
  }

  filtroHistoriasInput.addEventListener("input", aplicarFiltro);

  btnLimpiarFiltro.addEventListener("click", () => {
    filtroHistoriasInput.value = "";
    aplicarFiltro();
    filtroHistoriasInput.focus();
  });

  // --- Inicialización ---

  fechaHoraInput.value = fechaHoraActual();
  cargarSelects();
  renderTabla();
});
