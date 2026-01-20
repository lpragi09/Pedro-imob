"use server";

import nodemailer from "nodemailer";

export type ContactActionState = {
  ok: boolean;
  message: string;
};

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string) {
  // Validação simples o suficiente para UX (sem ser overkill)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function sendEmail(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  try {
    const honeypot = String(formData.get("website") ?? "").trim();
    if (honeypot) {
      return { ok: true, message: "Mensagem enviada com sucesso." };
    }

    const nome = String(formData.get("nome") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const mensagem = String(formData.get("mensagem") ?? "").trim();

    if (!nome || !email || !mensagem) {
      return { ok: false, message: "Preencha Nome, E-mail e Mensagem." };
    }
    if (!isValidEmail(email)) {
      return { ok: false, message: "Informe um e-mail válido." };
    }

    const user = process.env.ZOHO_SMTP_USER;
    const pass = process.env.ZOHO_SMTP_PASS;
    const to = process.env.CONTACT_TO || user;

    if (!user || !pass || !to) {
      return {
        ok: false,
        message:
          "Configuração de e-mail ausente no servidor. Verifique o .env.local.",
      };
    }

    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1f2937;">
        <h2 style="margin: 0 0 12px;">Novo contato — Terras Rurais</h2>
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <p style="margin: 0 0 8px;"><strong>Nome:</strong> ${escapeHtml(nome)}</p>
          <p style="margin: 0 0 8px;"><strong>E-mail:</strong> ${escapeHtml(email)}</p>
          <p style="margin: 0 0 8px;"><strong>WhatsApp:</strong> ${escapeHtml(whatsapp || "Não informado")}</p>
          <p style="margin: 12px 0 0;"><strong>Mensagem:</strong></p>
          <div style="white-space: pre-wrap; line-height: 1.5; padding: 12px; background: #f9fafb; border-radius: 10px; border: 1px solid #f3f4f6;">
            ${escapeHtml(mensagem)}
          </div>
        </div>
        <p style="margin: 12px 0 0; font-size: 12px; color: #6b7280;">
          Enviado via formulário do site.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `Terras Rurais <${user}>`,
      to,
      replyTo: email,
      subject: `Contato — ${nome}`,
      html,
    });

    return { ok: true, message: "Mensagem enviada com sucesso. Vamos te chamar!" };
  } catch (err) {
    return {
      ok: false,
      message:
        "Não foi possível enviar agora. Tente novamente em instantes ou chame no WhatsApp.",
    };
  }
}

