import nodemailer from 'nodemailer'

//configurando transportador que vai enviar o email
export const transpoter = nodemailer.createTransport({
    service: "gmail", //ja coloca o host e a porta padrão do gmail
    auth: {
        //utilizando as variaveis de hambiente
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

//criando função do disparo do email
export async function sendMail(to, subject, html){
    try {
        await transpoter.sendMail({
            from: `"Suporte The barber" <${process.env.EMAIL_USER}>`, //remetente
            to, //destinatario
            subject, //assunto do email
            html, //corpo do email em html
        }),
        console.log('email enviado')
    } catch (error) {
        console.error('erro ao enviar email', error)
        throw error
    }
}