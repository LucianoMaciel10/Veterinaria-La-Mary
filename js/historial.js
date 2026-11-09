document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos utilizando storage.js
  const mascotas = leerDatos("mascotas") || [];
  const veterinarios = leerDatos("veterinarios") || [];
  const historiasClinicas = leerDatos("historiasClinicas") || [];

  const selectMascota = document.getElementById("select-mascota");
  const mensajeEstado = document.getElementById("mensaje-estado");
  const contenidoHistorial = document.getElementById("contenido-historial");

  // Función para mostrar alertas de estado (Paso 6)
  function mostrarMensaje(texto, tipo = "info") {
    mensajeEstado.className = `alert alert-${tipo}`;
    mensajeEstado.textContent = texto;
    mensajeEstado.classList.remove("d-none");
    contenidoHistorial.classList.add("d-none");
  }

  function ocultarMensaje() {
    mensajeEstado.classList.add("d-none");
    contenidoHistorial.classList.remove("d-none");
  }

  // Paso 6: Caso sin mascotas en el sistema
  if (mascotas.length === 0) {
    mostrarMensaje("No hay mascotas registradas en el sistema.", "warning");
    selectMascota.innerHTML = '<option value="">Sin mascotas disponibles</option>';
    selectMascota.disabled = true;
    return;
  }

  // Paso 3: Llenar el selector de mascotas
  selectMascota.innerHTML = '<option value="">-- Seleccione una mascota --</option>';
  mascotas.forEach((m) => {
    const option = document.createElement("option");
    option.value = m.idMascota || m.id;
    option.textContent = `${m.nombreMascota || m.nombre} (${m.nombreDuenio || m.dueno || m.duenio})`;
    selectMascota.appendChild(option);
  });

  // Leer ID de la URL (?id=...)
  const urlParams = new URLSearchParams(window.location.search);
  const idMascotaUrl = urlParams.get("id");

  if (idMascotaUrl) {
    const existe = mascotas.some((m) => (m.idMascota || m.id) == idMascotaUrl);
    if (!existe) {
      // Paso 6: ID que no existe
      mostrarMensaje(`La mascota con ID ${idMascotaUrl} no existe.`, "danger");
      return;
    }
    selectMascota.value = idMascotaUrl;
    cargarHistorial(idMascotaUrl);
  } else {
    // Paso 6: Ninguna mascota elegida inicialmente
    mostrarMensaje("Por favor, selecciona una mascota para ver su historial.", "info");
  }

  // Evento al seleccionar en el dropdown
  selectMascota.addEventListener("change", (e) => {
    const idSeleccionado = e.target.value;
    if (idSeleccionado) {
      window.history.pushState({}, "", `historial.html?id=${idSeleccionado}`);
      cargarHistorial(idSeleccionado);
    } else {
      mostrarMensaje("Por favor, selecciona una mascota para ver su historial.", "info");
    }
  });

  // Renderizado de ficha e historias clínicas
  function cargarHistorial(id) {
    const mascota = mascotas.find((m) => (m.idMascota || m.id) == id);
    if (!mascota) return;

    ocultarMensaje();

    // Paso 4: Ficha de datos de la mascota
    document.getElementById("mascota-nombre").textContent = mascota.nombreMascota || mascota.nombre;
    document.getElementById("mascota-dueno").textContent = mascota.nombreDuenio || mascota.dueno || mascota.duenio || "N/A";
    document.getElementById("mascota-color").textContent = mascota.color || "N/A";
    document.getElementById("mascota-edad").textContent = mascota.edad ? `${mascota.edad} ${Number(mascota.edad) === 1 ? "año" : "años"}` : "N/A";
    document.getElementById("mascota-peso").textContent = mascota.peso ? `${Number(mascota.peso).toLocaleString("es-AR")} kg` : "N/A";

    // Paso 5: Filtrar entradas de la mascota
    const entradas = historiasClinicas.filter(
      (e) => (e.idMascota || e.mascotaId) == id
    );

    // Ordenar entradas: la más reciente primero
    entradas.sort((a, b) => new Date(b.fechaHora || b.fecha) - new Date(a.fechaHora || a.fecha));

    // Contador de entradas
    document.getElementById("contador-entradas").textContent = entradas.length;

    const contenedorLista = document.getElementById("lista-entradas");
    contenedorLista.innerHTML = "";

    // Paso 6: Mascota sin entradas cargadas
    if (entradas.length === 0) {
      contenedorLista.innerHTML = `
        <div class="alert alert-secondary mb-0">
          Esta mascota aún no posee entradas en su historia clínica.
        </div>`;
      return;
    }

    // Paso 5: Renderizar cada entrada clínica
    entradas.forEach((entrada) => {
      const vet = veterinarios.find(
        (v) => (v.idVeterinario || v.id) == (entrada.idVeterinario || entrada.veterinarioId)
      ) || {};

      const vetNombre = vet.nombreVeterinario || vet.nombre || entrada.veterinarioNombre || "Desconocido";
      const vetEspecialidad = vet.especialidad || "General";

      const fechaObj = new Date(entrada.fechaHora || entrada.fecha);
      const fechaFormateada = isNaN(fechaObj.getTime())
        ? (entrada.fechaHora || entrada.fecha)
        : fechaObj.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

      const item = document.createElement("div");
      item.className = "list-group-item list-group-item-action flex-column align-items-start mb-2 rounded border";
      item.innerHTML = `
        <div class="d-flex w-100 justify-content-between align-items-center mb-1">
          <h5 class="mb-0 text-primary h6">${fechaFormateada}</h5>
          <small class="text-muted">Vet: <strong>${vetNombre}</strong> (${vetEspecialidad})</small>
        </div>
        <p class="mb-0 mt-2 text-dark">${entrada.observaciones || entrada.diagnostico || "Sin observaciones."}</p>
      `;
      contenedorLista.appendChild(item);
    });
  }
});