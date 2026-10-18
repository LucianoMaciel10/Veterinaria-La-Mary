// CAPTURAR ELEMENTOS DEL DOM
const formMascota = document.getElementById('formMascota');
const idInput = document.getElementById('idMascota');
const nombreMascotaInput = document.getElementById('nombreMascota');
const nombreDuenioInput = document.getElementById('nombreDuenio');
const colorInput = document.getElementById('color');
const edadInput = document.getElementById('edad');
const pesoInput = document.getElementById('peso');
const btnCancelar = document.getElementById('btnCancelar');

// EVENTO AL ENVIAR EL FORMULARIO (SUBMIT)
formMascota.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombreMascota = nombreMascotaInput.value.trim();
  const nombreDuenio = nombreDuenioInput.value.trim();
  const color = colorInput.value.trim();
  const edad = parseInt(edadInput.value);
  const peso = parseFloat(pesoInput.value);
  const idExistente = idInput.value;

  // --- VALIDACIONES REQUERIDAS ---
  if (!nombreMascota) {
    alert('Por favor, ingrese un nombre de mascota válido (no puede estar vacío ni contener solo espacios).');
    nombreMascotaInput.focus();
    return;
  }

  if (!nombreDuenio) {
    alert('Por favor, ingrese un nombre de dueño válido.');
    nombreDuenioInput.focus();
    return;
  }

  if (!color) {
    alert('Por favor, ingrese un color válido.');
    colorInput.focus();
    return;
  }

  if (isNaN(edad) || !Number.isInteger(edad) || edad < 0) {
    alert('La edad debe ser un número entero mayor o igual a cero.');
    edadInput.focus();
    return;
  }

  if (isNaN(peso) || peso <= 0) {
    alert('El peso debe ser un número mayor a cero.');
    pesoInput.focus();
    return;
  }
  // ---------------------------------

  let listaMascotas = leerDatos('mascotas') || [];

  if (idExistente) {
    // EDITAR REGISTRO EXISTENTE
    listaMascotas = listaMascotas.map(mascota => {
      if (mascota.idMascota === idExistente) {
        return {
          idMascota: idExistente,
          nombreMascota,
          nombreDuenio,
          color,
          edad,
          peso
        };
      }
      return mascota;
    });
  } else {
    // NUEVO REGISTRO
    const nuevaMascota = {
      idMascota: generarId(),
      nombreMascota,
      nombreDuenio,
      color,
      edad,
      peso
    };
    listaMascotas.push(nuevaMascota);
  }

  guardarDatos('mascotas', listaMascotas);
  limpiarFormulario();

  if (typeof renderTabla === 'function') {
    renderTabla();
  } else if (typeof RenderTabla === 'function') {
    RenderTabla();
  }
});

// FUNCIÓN PARA CARGAR DATOS AL EDITAR
function cargarEnFormulario(id) {
  const listaMascotas = leerDatos('mascotas') || [];
  const mascota = listaMascotas.find(item => item.idMascota === id);

  if (mascota) {
    idInput.value = mascota.idMascota;
    nombreMascotaInput.value = mascota.nombreMascota;
    nombreDuenioInput.value = mascota.nombreDuenio;
    colorInput.value = mascota.color;
    edadInput.value = mascota.edad;
    pesoInput.value = mascota.peso;
  }
}

// LIMPIAR FORMULARIO
function limpiarFormulario() {
  formMascota.reset();
  idInput.value = '';
}

btnCancelar.addEventListener('click', limpiarFormulario);

// ==========================================================================
// TABLA DE MASCOTAS
// ==========================================================================

// Redibuja la tabla con lo que hay en LocalStorage y actualiza el contador
function renderTabla() {
  const mascotas = leerDatos('mascotas') || [];
  const cuerpo = document.getElementById('cuerpoTablaMascotas');
  const cantidad = document.getElementById('cantidadMascotas');

  cantidad.textContent = mascotas.length;
  cuerpo.replaceChildren();

  if (mascotas.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.className = 'text-center text-muted py-4';
    td.textContent = 'Todavía no hay mascotas registradas.';
    tr.appendChild(td);
    cuerpo.appendChild(tr);
    return;
  }

  mascotas.forEach((m) => {
    const tr = document.createElement('tr');

    [
      m.nombreMascota,
      m.nombreDuenio,
      m.color,
      `${m.edad} ${Number(m.edad) === 1 ? 'año' : 'años'}`,
      `${Number(m.peso).toLocaleString('es-AR')} kg`,
    ].forEach((texto) => {
      const td = document.createElement('td');
      td.textContent = texto; // textContent evita inyección de HTML
      tr.appendChild(td);
    });

    // Acciones
    const tdAcciones = document.createElement('td');
    tdAcciones.className = 'text-nowrap';

    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn btn-sm text-white me-1';
    btnEditar.style.backgroundColor = '#d97f3c';
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', () => {
      cargarEnFormulario(m.idMascota);
      formMascota.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nombreMascotaInput.focus();
    });

    const btnEliminar = document.createElement('button');
    btnEliminar.type = 'button';
    btnEliminar.className = 'btn btn-sm btn-outline-danger';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', () => eliminarMascota(m.idMascota));

    tdAcciones.append(btnEditar, btnEliminar);
    tr.appendChild(tdAcciones);
    cuerpo.appendChild(tr);
  });
}

// Elimina una mascota previa confirmación y actualiza la tabla
function eliminarMascota(id) {
  const mascotas = leerDatos('mascotas') || [];
  const m = mascotas.find((x) => x.idMascota === id);
  if (!m) return;
  if (!confirm(`¿Seguro que querés eliminar a ${m.nombreMascota}?`)) return;

  guardarDatos('mascotas', mascotas.filter((x) => x.idMascota !== id));

  // Si justo se estaba editando esa mascota, se limpia el formulario
  if (idInput.value === id) limpiarFormulario();

  renderTabla();
}

// Al cargar la página se muestra lo que ya está guardado
document.addEventListener('DOMContentLoaded', renderTabla);
