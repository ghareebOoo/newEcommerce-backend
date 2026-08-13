import nodemailer from "nodemailer";

const sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message
    });
};

export default sendEmail;