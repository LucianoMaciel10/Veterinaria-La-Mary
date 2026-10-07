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
