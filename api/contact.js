import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { nome, email, empresa, mensagem } = req.body;

  if (!nome || !email || !empresa || !mensagem) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }

  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  try {

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: "bescheiben@gmail.com",
      replyTo: email,
      subject: `Contato de ${nome}`,
      text: `
Nome: ${nome}
Email: ${email}
Empresa: ${empresa}

Mensagem:
${mensagem}
`
    });

    return res.status(200).json({ success: true });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ success: false });

  }

}