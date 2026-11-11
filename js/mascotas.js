document.addEventListener("DOMContentLoaded", () => {
  const formMascota = document.getElementById("formMascota");
  const inputIdMascota = document.getElementById("idMascota");
  const inputNombreMascota = document.getElementById("nombreMascota");
  const inputNombreDuenio = document.getElementById("nombreDuenio");
  const inputColor = document.getElementById("color");
  const inputEdad = document.getElementById("edad");
  const inputPeso = document.getElementById("peso");
  const cuerpoTablaMascotas = document.getElementById("cuerpoTablaMascotas");

  let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

  function renderizarTabla() {
    if (!cuerpoTablaMascotas) return;
    cuerpoTablaMascotas.replaceChildren();

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

      const btnHistorial = document.createElement("a");
      btnHistorial.href = `historial.html?id=${mascota.idMascota}`;
      btnHistorial.className = "btn btn-sm btn-sitio-oscuro me-2";
      btnHistorial.textContent = "Ver historial";

      const btnEditar = document.createElement("button");
      btnEditar.type = "button";
      btnEditar.className = "btn btn-sm btn-outline-primary me-2";
      btnEditar.textContent = "Editar";
      btnEditar.addEventListener("click", () => cargarFormularioEditar(mascota.idMascota));

      const btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.className = "btn btn-sm btn-outline-danger";
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () => eliminarMascota(mascota.idMascota));

      tdAcciones.appendChild(btnHistorial);
      tdAcciones.appendChild(btnEditar);
      tdAcciones.appendChild(btnEliminar);

      tr.appendChild(tdId);
      tr.appendChild(tdNombre);
      tr.appendChild(tdDuenio);
      tr.appendChild(tdColor);
      tr.appendChild(tdEdad);
      tr.appendChild(tdPeso);
      tr.appendChild(tdAcciones);

      cuerpoTablaMascotas.appendChild(tr);
    });
  }

  if (formMascota) {
    formMascota.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombreMascota = inputNombreMascota ? inputNombreMascota.value.trim() : "";
      const nombreDuenio = inputNombreDuenio ? inputNombreDuenio.value.trim() : "";
      const color = inputColor ? inputColor.value.trim() : "";
      const edadVal = inputEdad ? inputEdad.value.trim() : "";
      const pesoVal = inputPeso ? inputPeso.value.trim() : "";

      if (!nombreMascota || !nombreDuenio) {
        alert("Por favor completa los campos requeridos (Nombre de mascota y Dueño).");
        return;
      }

      const idEditar = inputIdMascota ? inputIdMascota.value : "";

      if (idEditar) {
        const index = mascotas.findIndex(m => String(m.idMascota) === String(idEditar));
        if (index !== -1) {
          mascotas[index] = {
            idMascota: mascotas[index].idMascota,
            nombreMascota,
            nombreDuenio,
            color,
            edad: edadVal !== "" ? Number(edadVal) : "",
            peso: pesoVal !== "" ? Number(pesoVal) : ""
          };
        }
        if (inputIdMascota) inputIdMascota.value = "";
      } else {
        const nuevoId = mascotas.length > 0 
          ? Math.max(...mascotas.map(m => Number(m.idMascota) || 0)) + 1 
          : 1;

        const nuevaMascota = {
          idMascota: nuevoId,
          nombreMascota,
          nombreDuenio,
          color,
          edad: edadVal !== "" ? Number(edadVal) : "",
          peso: pesoVal !== "" ? Number(pesoVal) : ""
        };

        mascotas.push(nuevaMascota);
      }

      localStorage.setItem("mascotas", JSON.stringify(mascotas));
      formMascota.reset();
      renderizarTabla();
    });
  }

  function cargarFormularioEditar(id) {
    const mascota = mascotas.find(m => String(m.idMascota) === String(id));
    if (!mascota) return;

    if (inputIdMascota) inputIdMascota.value = mascota.idMascota;
    if (inputNombreMascota) inputNombreMascota.value = mascota.nombreMascota;
    if (inputNombreDuenio) inputNombreDuenio.value = mascota.nombreDuenio || "";
    if (inputColor) inputColor.value = mascota.color || "";
    if (inputEdad) inputEdad.value = (mascota.edad !== null && mascota.edad !== undefined) ? mascota.edad : "";
    if (inputPeso) inputPeso.value = (mascota.peso !== null && mascota.peso !== undefined) ? mascota.peso : "";
  }

  function eliminarMascota(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta mascota?")) return;

    mascotas = mascotas.filter(m => String(m.idMascota) !== String(id));
    localStorage.setItem("mascotas", JSON.stringify(mascotas));
    renderizarTabla();
  }

  renderizarTabla();
});