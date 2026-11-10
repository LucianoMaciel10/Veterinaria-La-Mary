document.addEventListener("DOMContentLoaded", () => {
  const tablaMascotasBody = document.getElementById("tablaMascotasBody");
  const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

  function renderizarTablaMascotas() {
    if (!tablaMascotasBody) return;
    tablaMascotasBody.replaceChildren();

    mascotas.forEach(mascota => {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = mascota.idMascota;

      const tdNombre = document.createElement("td");
      tdNombre.textContent = mascota.nombreMascota;

      const tdDuenio = document.createElement("td");
      tdDuenio.textContent = mascota.nombreDuenio || "N/A";

      const tdColor = document.createElement("td");
      tdColor.textContent = mascota.color || "N/A";

      const tdEdad = document.createElement("td");
      tdEdad.textContent = (mascota.edad !== null && mascota.edad !== undefined && mascota.edad !== "")
        ? `${mascota.edad} años`
        : "N/A";

      const tdPeso = document.createElement("td");
      tdPeso.textContent = (mascota.peso !== null && mascota.peso !== undefined && mascota.peso !== "")
        ? `${mascota.peso} kg`
        : "N/A";

      const tdAcciones = document.createElement("td");

      // Botón Ver historial con la clase del sitio
      const btnHistorial = document.createElement("a");
      btnHistorial.href = `historial.html?id=${mascota.idMascota}`;
      btnHistorial.className = "btn btn-sm btn-sitio-oscuro me-2";
      btnHistorial.textContent = "Ver historial";

      tdAcciones.appendChild(btnHistorial);

      tr.appendChild(tdId);
      tr.appendChild(tdNombre);
      tr.appendChild(tdDuenio);
      tr.appendChild(tdColor);
      tr.appendChild(tdEdad);
      tr.appendChild(tdPeso);
      tr.appendChild(tdAcciones);

      tablaMascotasBody.appendChild(tr);
    });
  }

  renderizarTablaMascotas();
});