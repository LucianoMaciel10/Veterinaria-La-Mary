document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  const estado = document.getElementById("mensajeEstado");
  let timeoutId;

  const mostrarMensaje = (tipo, texto) => {
    clearInterval(timeoutId);
    estado.classList.remove("error");
    estado.classList.remove("exito");
    estado.classList.add(tipo);
    estado.textContent = texto;
    estado.classList.remove("invisible");

    timeoutId = setTimeout(() => {
      estado.classList.add("invisible");
    }, 4000);
  };

  const marcarCampo = (input, valido) => {
    input.classList.toggle("invalido", !valido);
  };

  const validarCampo = (input) => {
    let valido = true;
    const span = document.querySelector(`[data-error-de="${input.id}"]`);

    if (input.required && !input.value.trim()) {
      valido = false;
      span.textContent = "Este campo es obligatorio.";
    } else if (input.minLength && input.value.trim().length < input.minLength) {
      valido = false;
      span.textContent = `Debe tener al menos ${input.minLength} caracteres.`;
    } else if (input.type === "email" && input.value.trim()) {
      const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valido = patron.test(input.value.trim());
      if (!valido) span.textContent = "Ingresá un correo válido.";
    }
    span.classList.remove("invisible");

    if (valido) span.classList.add("invisible");
    marcarCampo(input, valido);
    return valido;
  };

  const limpiarError = (e) => {
    const span = document.querySelector(`[data-error-de="${e.target.id}"]`);
    span.classList.add("invisible");
    e.target.classList.remove("invalido");
  };

  form.querySelectorAll("input, textarea").forEach((campo) => {
    campo.addEventListener("input", limpiarError);
    campo.addEventListener("blur", () => validarCampo(campo));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formValido = true;
    form.querySelectorAll("input, textarea").forEach((campo) => {
      if (!validarCampo(campo)) formValido = false;
    });

    if (!formValido) {
      mostrarMensaje(
        "error",
        "Revisá los campos marcados antes de enviar tu consulta."
      );
      return;
    }

    const mascota = document.getElementById("mascota").value.trim();
    mostrarMensaje(
      "exito",
      `¡Gracias${mascota ? " y a " + mascota : ""}! Tu consulta se envió con éxito, te vamos a responder pronto.`
    );
    form.reset();
  });
});
