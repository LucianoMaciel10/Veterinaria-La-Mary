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
    const sinMascotas = document.createElement("option");
    sinMascotas.value = "";
    sinMascotas.textContent = "Sin mascotas disponibles";
    selectMascota.replaceChildren(sinMascotas);
    selectMascota.disabled = true;
    return;
  }

  // Paso 3: Llenar el selector de mascotas
  const inicial = document.createElement("option");
  inicial.value = "";
  inicial.textContent = "Seleccioná una mascota";
  selectMascota.replaceChildren(inicial);
  mascotas.forEach((m) => {
    const option = document.createElement("option");
    option.value = m.idMascota;
    option.textContent = `${m.nombreMascota} (${m.nombreDuenio})`;
    selectMascota.appendChild(option);
  });

  // Evento al seleccionar en el dropdown (registrado antes de revisar el id de la URL)
  selectMascota.addEventListener("change", (e) => {
    const idSeleccionado = e.target.value;
    if (idSeleccionado) {
      window.history.replaceState(
        {},
        "",
        `historial.html?id=${idSeleccionado}`,
      );
      cargarHistorial(idSeleccionado);
    } else {
      window.history.replaceState({}, "", "historial.html");
      mostrarMensaje("Seleccioná una mascota para ver su historial.", "info");
    }
  });

  // Leer ID de la URL (?id=...)
  const urlParams = new URLSearchParams(window.location.search);
  const idMascotaUrl = urlParams.get("id");

  if (idMascotaUrl) {
    const existe = mascotas.some((m) => m.idMascota === idMascotaUrl);
    if (!existe) {
      // Paso 6: ID que no existe
      mostrarMensaje(`La mascota con ID ${idMascotaUrl} no existe.`, "danger");
      return;
    }
    selectMascota.value = idMascotaUrl;
    cargarHistorial(idMascotaUrl);
  } else {
    // Paso 6: Ninguna mascota elegida inicialmente
    mostrarMensaje("Seleccioná una mascota para ver su historial.", "info");
  }

  // Renderizado de ficha e historias clínicas
  function cargarHistorial(id) {
    const mascota = mascotas.find((m) => m.idMascota === id);
    if (!mascota) return;

    ocultarMensaje();

    // Paso 4: Ficha de datos de la mascota
    document.getElementById("mascota-nombre").textContent =
      mascota.nombreMascota;
    document.getElementById("mascota-dueno").textContent = mascota.nombreDuenio;
    document.getElementById("mascota-color").textContent = mascota.color;
    document.getElementById("mascota-edad").textContent =
      `${mascota.edad} ${Number(mascota.edad) === 1 ? "año" : "años"}`;
    document.getElementById("mascota-peso").textContent =
      `${Number(mascota.peso).toLocaleString("es-AR")} kg`;

    // Paso 5: Filtrar entradas de la mascota
    const entradas = historiasClinicas.filter((e) => e.mascota === id);

    // Ordenar entradas: la más reciente primero
    entradas.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));

    // Contador de entradas
    document.getElementById("contador-entradas").textContent = entradas.length;

    const contenedorLista = document.getElementById("lista-entradas");
    contenedorLista.replaceChildren();

    // Paso 6: Mascota sin entradas cargadas
    if (entradas.length === 0) {
      const vacio = document.createElement("div");
      vacio.className = "alert alert-secondary mb-0";
      vacio.textContent =
        "Esta mascota aún no posee entradas en su historia clínica.";
      contenedorLista.appendChild(vacio);
      return;
    }

    // Paso 5: Renderizar cada entrada clínica
    entradas.forEach((entrada) => {
      const vet = veterinarios.find(
        (v) => v.idVeterinario === entrada.veterinario,
      );

      const fechaObj = new Date(entrada.fechaHora);
      const fechaFormateada = isNaN(fechaObj.getTime())
        ? entrada.fechaHora
        : fechaObj.toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
          });

      const item = document.createElement("div");
      item.className =
        "list-group-item entrada-historial flex-column align-items-start mb-2 rounded border";

      const encabezado = document.createElement("div");
      encabezado.className =
        "d-flex w-100 justify-content-between align-items-center mb-1";

      const fecha = document.createElement("h5");
      fecha.className = "fecha-entrada h6 mb-0";
      fecha.textContent = fechaFormateada;

      const infoVet = document.createElement("small");
      infoVet.className = "text-muted";
      infoVet.append("Vet: ");
      const strongVet = document.createElement("strong");
      if (vet) {
        strongVet.textContent = vet.nombre;
        infoVet.append(strongVet, ` (${vet.especializacion})`);
      } else {
        strongVet.textContent = "Eliminado";
        infoVet.append(strongVet);
      }

      encabezado.append(fecha, infoVet);

      const observaciones = document.createElement("p");
      observaciones.className = "mb-0 mt-2 text-dark";
      observaciones.style.whiteSpace = "pre-wrap";
      observaciones.style.wordBreak = "break-word";
      observaciones.textContent = entrada.observaciones || "Sin observaciones.";

      item.append(encabezado, observaciones);
      contenedorLista.appendChild(item);
    });
  }
});
