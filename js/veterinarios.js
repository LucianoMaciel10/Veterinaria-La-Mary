//  CAPTURAR ELEMENTOS DEL DOM
const formVeterinario = document.getElementById('formVeterinario');
const idInput = document.getElementById('idVeterinario');
const matriculaInput = document.getElementById('matricula');
const nombreInput = document.getElementById('nombre');
const especializacionInput = document.getElementById('especializacion');
const valorConsultaInput = document.getElementById('valorConsulta');
const btnCancelar = document.getElementById('btnCancelar');
const cuerpoTablaVeterinarios = document.getElementById(
  'cuerpoTablaVeterinarios'
);

//  EVENTO AL ENVIAR EL FORMULARIO (SUBMIT)
formVeterinario.addEventListener('submit', function (e) {
  e.preventDefault();

  const matricula = parseInt(matriculaInput.value);
  const nombre = nombreInput.value.trim();
  const especializacion = especializacionInput.value.trim();
  const valorConsulta = parseFloat(valorConsultaInput.value);
  const idExistente = idInput.value;

  // --- VALIDACIONES REQUERIDAS ---
  if (!nombre) {
    alert('Por favor, ingrese un nombre válido (no puede estar vacío ni contener solo espacios).');
    nombreInput.focus();
    return;
  }

  if (!especializacion) {
    alert('Por favor, ingrese una especialización válida.');
    especializacionInput.focus();
    return;
  }

  if (isNaN(matricula) || matricula <= 0) {
    alert('La matrícula debe ser un número entero positivo.');
    matriculaInput.focus();
    return;
  }

  if (isNaN(valorConsulta) || valorConsulta <= 0) {
    alert('El valor de la consulta debe ser un número mayor a cero.');
    valorConsultaInput.focus();
    return;
  }
  // ---------------------------------

  let listaVeterinarios = leerDatos('veterinarios') || [];

  if (idExistente) {
    // EDITAR REGISTRO EXISTENTE
    listaVeterinarios = listaVeterinarios.map(vet => {
      if (vet.idVeterinario === idExistente) {
        return {
          idVeterinario: idExistente,
          matricula,
          nombre,
          especializacion,
          valorConsulta
        };
      }
      return vet;
    });
  } else {
    // NUEVO REGISTRO
    const nuevoVeterinario = {
      idVeterinario: generarId(),
      matricula,
      nombre,
      especializacion,
      valorConsulta
    };
    listaVeterinarios.push(nuevoVeterinario);
  }

  guardarDatos('veterinarios', listaVeterinarios);
  limpiarFormulario();

  if (typeof renderTabla === 'function') {
    renderTabla();
  }
});

// FUNCIÓN PARA CARGAR DATOS AL EDITAR
function cargarEnFormulario(id) {
  const listaVeterinarios = leerDatos('veterinarios') || [];
  const vet = listaVeterinarios.find(item => item.idVeterinario === id);

  if (vet) {
    idInput.value = vet.idVeterinario;
    matriculaInput.value = vet.matricula;
    nombreInput.value = vet.nombre;
    especializacionInput.value = vet.especializacion;
    valorConsultaInput.value = vet.valorConsulta;
  }
}

//  LIMPIAR FORMULARIO
function limpiarFormulario() {
  formVeterinario.reset();
  idInput.value = '';
}

btnCancelar.addEventListener('click', limpiarFormulario);

// Muestra los veterinarios guardados en la tabla.
function renderTabla() {
  const listaVeterinarios = leerDatos('veterinarios');
  cuerpoTablaVeterinarios.replaceChildren();

  if (listaVeterinarios.length === 0) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');

    celda.colSpan = 5;
    celda.className = 'text-center text-muted py-4';
    celda.textContent = 'Todavía no hay veterinarios registrados.';

    fila.appendChild(celda);
    cuerpoTablaVeterinarios.appendChild(fila);
    return;
  }

  listaVeterinarios.forEach(function (veterinario) {
    const fila = document.createElement('tr');

    const datos = [
      veterinario.matricula,
      veterinario.nombre,
      veterinario.especializacion,
      '$' + Number(veterinario.valorConsulta).toLocaleString('es-AR')
    ];

    datos.forEach(function (dato) {
      const celda = document.createElement('td');
      celda.textContent = dato;
      fila.appendChild(celda);
    });

    const celdaAcciones = document.createElement('td');
    celdaAcciones.className = 'd-flex gap-2';

    const botonEditar = document.createElement('button');
    botonEditar.type = 'button';
    botonEditar.className = 'btn btn-sm btn-primary';
    botonEditar.textContent = 'Editar';
    botonEditar.addEventListener('click', function () {
      cargarEnFormulario(veterinario.idVeterinario);
    });

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.className = 'btn btn-sm btn-danger';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', function () {
      eliminarVeterinario(veterinario.idVeterinario);
    });

    celdaAcciones.append(botonEditar, botonEliminar);
    fila.appendChild(celdaAcciones);
    cuerpoTablaVeterinarios.appendChild(fila);
  });
}

// Elimina un veterinario después de pedir confirmación.
function eliminarVeterinario(id) {
  const confirmar = confirm(
    '¿Está seguro de que desea eliminar este veterinario?'
  );

  if (!confirmar) {
    return;
  }

  const listaVeterinarios = leerDatos('veterinarios');
  const listaActualizada = listaVeterinarios.filter(function (veterinario) {
    return veterinario.idVeterinario !== id;
  });

  guardarDatos('veterinarios', listaActualizada);
  renderTabla();
}

// Dibuja la tabla al abrir la página.
renderTabla();