import nodemailer from "nodemailer";

type OpcoesEmail = {
  para: string | string[];
  assunto: string;
  texto: string;
  html?: string;
};

function smtpConfigurado(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

export async function enviarEmail(opcoes: OpcoesEmail): Promise<boolean> {
  if (!smtpConfigurado()) {
    console.warn("[email] SMTP não configurado — e-mail não enviado:", opcoes.assunto);
    console.info("[email] Destinatário(s):", opcoes.para);
    console.info("[email] Corpo:\n", opcoes.texto);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  const destinatarios = Array.isArray(opcoes.para) ? opcoes.para.join(", ") : opcoes.para;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: destinatarios,
      subject: opcoes.assunto,
      text: opcoes.texto,
      html: opcoes.html ?? opcoes.texto.replace(/\n/g, "<br>"),
    });
    return true;
  } catch (err) {
    console.error("[email] Falha ao enviar:", err);
    return false;
  }
}
