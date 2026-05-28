import Mailgen from "mailgen"
import nodemailer from "nodemailer"


const sendEmail = async (options)=> {
        const mailGenerator = new Mailgen({
              theme : "default",
              product: {
                 name: "webinox",
                 link: "https://abcwebinox.com",

              }
        })

        const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
        const emailHTML = mailGenerator.generate(options.mailgenContent);

        const Transporter = nodemailer.createTransport({
                 host: process.env.MAILTRAP_SMTP_HOST,
                 port: process.env.MAILTRAP_SMTP_PORT,

                 auth: {
                     user: process.env.MAILTRAP_SMTP_USER,
                     pass: process.env.MAILTRAP_SMTP_PASS
                 }
        })

        const mail = {
             from: "webinoxabc@gmail.com",
             to: options.email,
             subject: options.subject,
             text: emailTextual,
             html: emailHTML,
        }

        try{
            await Transporter.sendMail(mail);
        }
        catch(error){
             console.error("mail service failed")
             console.error("😒ERROR:",error)
        }
}



const emailVerificationMailgenContent = (username,verificationUrl) => {
      return {
          body: {
        name: username,
        intro: 'Welcome to Webinox! We\'re very excited to have you on board.',
        action: {
            instructions: 'To get started with Webinox, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: verificationUrl
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
      }
}



const forgotPasswordMailgenContent = (username,passwordResetUrl) => {
            return {
          body: {
        name: username,
        intro: 'Mail to reset Password',
        action: {
            instructions: 'To reset password, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Reset Password',
                link: passwordResetUrl
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
      }
}

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail,
}