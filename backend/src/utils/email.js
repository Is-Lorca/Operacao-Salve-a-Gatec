const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function enviarEmailRec(emailDest, token){
    const linkRec = `http://localhost:3000/api/{token}`;

    const mailOptions = {
        from: `"Suporte Operação Salve a Gatec" <${process.env.EMAIL_USER}>`,
        to: emailDest,
        subject: 'Recuperação de Senha',
        html: `
                <h1>Recuperação de Senha</h1>
                <p>Você solicitou a alteração da senha. Clique no link abaixo para criar uma nova senha:</p>
                <a href="${linkRec}" target="_blank" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Alterar Minha Senha</a>
                <p>Este link é válido por 1 hora.</p>
                <p>Se você não solicitou isso, pode descartar este e-mail.</p>
        `
    };
    
    return transporter.sendMail(mailOptions);
}

module.exports = {enviarEmailRec};