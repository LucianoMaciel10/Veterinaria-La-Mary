// 1. CAPTURAR ELEMENTOS DEL DOM
const formVeterinario = document.getElementById('formVeterinario');
const idInput = document.getElementById('idVeterinario');
const matriculaInput = document.getElementById('matricula');
const nombreInput = document.getElementById('nombre');
const especializacionInput = document.getElementById('especializacion');
const valorConsultaInput = document.getElementById('valorConsulta');
const btnCancelar = document.getElementById('btnCancelar');

// 2. EVENTO AL ENVIAR EL FORMULARIO (SUBMIT)
formVeterinario.addEventListener('submit', function (e) {
  e.preventDefault();

  const matricula = parseInt(matriculaInput.value);
  const nombre = nombreInput.value.trim();
  const especializacion = especializacionInput.value.trim();
  const valorConsulta = parseFloat(valorConsultaInput.value);
  const idExistente = idInput.value;

  let listaVeterinarios = leerDatos('veterinarios') || [];

  if (idExistente) {
    // EDITAR
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
    // NUEVO
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

// 3. FUNCIÓN PARA CARGAR DATOS AL EDITAR (Ariel)
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

// 4. LIMPIAR FORMULARIO
function limpiarFormulario() {
  formVeterinario.reset();
  idInput.value = '';
}

btnCancelar.addEventListener('click', limpiarFormulario);