document.addEventListener("DOMContentLoaded", () => {
  const selectMascota = document.getElementById("selectMascota");
  const fichaMascota = document.getElementById("fichaMascota");
  const seccionHistorial = document.getElementById("seccionHistorial");
  const listaHistorial = document.getElementById("listaHistorial");
  const contadorEntradas = document.getElementById("contadorEntradas");
  const mensajeError = document.getElementById("mensajeError");

  const mascotaNombre = document.getElementById("mascotaNombre");
  const mascotaDuenio = document.getElementById("mascotaDuenio");
  const mascotaColor = document.getElementById("mascotaColor");
  const mascotaEdad = document.getElementById("mascotaEdad");
  const mascotaPeso = document.getElementById("mascotaPeso");

  const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
  const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];
  const entradas = JSON.parse(localStorage.getItem("historiasClinicas")) || [];

  mascotas.forEach(mascota => {
    const option = document.createElement("option");
    option.value = mascota.idMascota;
    option.textContent = `${mascota.nombreMascota} (${mascota.nombreDuenio})`;
    selectMascota.appendChild(option);
  });

  selectMascota.addEventListener("change", (e) => {
    const idSeleccionado = e.target.value;
    if (idSeleccionado) {
      cargarHistorialMascota(idSeleccionado);
    } else {
      ocultarDetalles();
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const idMascotaUrl = urlParams.get("id");

  if (idMascotaUrl) {
    selectMascota.value = idMascotaUrl;
    const existe = mascotas.some(m => String(m.idMascota) === String(idMascotaUrl));
    if (existe) {
      cargarHistorialMascota(idMascotaUrl);
    } else {
      mostrarError("La mascota especificada no existe en el sistema.");
    }
  }

  function cargarHistorialMascota(idMascota) {
    ocultarMensajes();
    const mascota = mascotas.find(m => String(m.idMascota) === String(idMascota));

    if (!mascota) {
      mostrarError("No se encontró la mascota seleccionada.");
      return;
    }

    mascotaNombre.textContent = mascota.nombreMascota;
    mascotaDuenio.textContent = mascota.nombreDuenio || "N/A";
    mascotaColor.textContent = mascota.color || "N/A";

    mascotaEdad.textContent = (mascota.edad !== null && mascota.edad !== undefined && mascota.edad !== "") 
      ? `${mascota.edad} años` 
      : "N/A";

    mascotaPeso.textContent = (mascota.peso !== null && mascota.peso !== undefined && mascota.peso !== "") 
      ? `${mascota.peso} kg` 
      : "N/A";

    fichaMascota.classList.remove("d-none");

    const entradasMascota = entradas.filter(e => String(e.mascota) === String(idMascota));

    listaHistorial.replaceChildren();

    entradasMascota.forEach(entrada => {
      const li = document.createElement("li");
      li.className = "list-group-item entrada-historial mb-2 rounded shadow-sm";

      const headerDiv = document.createElement("div");
      headerDiv.className = "d-flex w-100 justify-content-between align-items-center mb-2";

      const fechaEl = document.createElement("h6");
      fechaEl.className = "fecha-entrada mb-0";
      fechaEl.textContent = entrada.fechaHora || "Fecha no registrada";

      const vet = veterinarios.find(v => String(v.idVeterinario) === String(entrada.veterinario));
      const vetNombre = vet ? vet.nombre : "Eliminado";

      const vetEl = document.createElement("small");
      vetEl.className = "text-muted";
      vetEl.textContent = `Atendido por: ${vetNombre}`;

      headerDiv.appendChild(fechaEl);
      headerDiv.appendChild(vetEl);

      const obsEl = document.createElement("p");
      obsEl.className = "mb-1 text-secondary";
      obsEl.style.whiteSpace = "pre-wrap";
      obsEl.style.wordBreak = "break-word";
      obsEl.textContent = entrada.observaciones || "";

      li.appendChild(headerDiv);
      li.appendChild(obsEl);
      listaHistorial.appendChild(li);
    });

    contadorEntradas.textContent = `Total: ${entradasMascota.length}`;
    seccionHistorial.classList.remove("d-none");
  }

  function ocultarDetalles() {
    fichaMascota.classList.add("d-none");
    seccionHistorial.classList.add("d-none");
    ocultarMensajes();
  }

  function mostrarError(msj) {
    ocultarDetalles();
    mensajeError.textContent = msj;
    mensajeError.classList.remove("d-none");
  }

  function ocultarMensajes() {
    mensajeError.classList.add("d-none");
  }
});