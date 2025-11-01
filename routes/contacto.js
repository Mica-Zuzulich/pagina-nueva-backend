import express from "express";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/send", async (req, res) => {
  const { nombre, email, mensaje, captchaToken } = req.body;

  try {
    const captchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      }
    );

    const captchaData = await captchaResponse.json();

    if (!captchaData.success) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha inválido o expirado" });
    }
  } catch (error) {
    console.error("Error al verificar captcha:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al verificar captcha" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: `"Formulario Rizzi" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: `Nuevo mensaje de ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`,
    });

    res.status(200).json({ success: true, message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ success: false, message: "Error al enviar el correo" });
  }
});

export default router;
