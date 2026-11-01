document.addEventListener("DOMContentLoaded", () => {
  // si ya está logueado lo mando directo al index
  if (sessionStorage.getItem("token")) {
    window.location.href = "index.html";
    return;
  }

  const formLogin = document.getElementById("formLogin");
  const inputUser = document.getElementById("username");
  const inputPass = document.getElementById("password");
  const btnIngresar = document.getElementById("btnIngresar");
  const mensajeError = document.getElementById("mensajeError");

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault(); // freno el form para que no recargue la página

    const username = inputUser.value.trim();
    const password = inputPass.value.trim();

    // escondo el error viejo y bloqueo el botón mientras carga
    mensajeError.classList.add("d-none");
    btnIngresar.disabled = true;
    btnIngresar.textContent = "Ingresando...";

    try {
      // le pego a la api de dummyjson con los datos del usuario
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        // guardo el token usando la función de auth.js
        guardarSesion(data.accessToken);
        window.location.href = "index.html";
      } else {
        // si le erró a la clave muestro el cartelito rojo
        mensajeError.textContent = "Usuario o contraseña incorrectos.";
        mensajeError.classList.remove("d-none");
      }
    } catch (error) {
      // atajo el error por si se cae internet o falla la api
      mensajeError.textContent =
        "Error de conexión. Intente nuevamente más tarde.";
      mensajeError.classList.remove("d-none");
    } finally {
      // vuelvo a habilitar el botón pase lo que pase
      btnIngresar.disabled = false;
      btnIngresar.textContent = "Ingresar";
    }
  });
});
