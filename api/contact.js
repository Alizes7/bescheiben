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
  from: `"Site Bescheiben" <${process.env.MAIL_USER}>`,
  to: "bescheiben@gmail.com",
  replyTo: email,
  subject: `Novo Lead | ${empresa} | ${nome}`,
  html: `
  <div style="font-family: Arial, sans-serif; max-width:600px;">
    
    <h2 style="color:#4F46E5;">Novo contato do site</h2>

    <p>Um novo lead enviou mensagem pelo formulário.</p>

    <hr/>

    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Empresa:</strong> ${empresa}</p>

    <p><strong>Mensagem:</strong></p>

    <div style="background:#f5f5f5;padding:12px;border-radius:6px;">
      ${mensagem}
    </div>

  </div>
  `
});

    return res.status(200).json({ success: true });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ success: false });

  }

}