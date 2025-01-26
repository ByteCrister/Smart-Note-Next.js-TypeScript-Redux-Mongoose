import nodemailer from "nodemailer";

export const emailAuthentication = async (To: string, subject: string, html: string) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_AUTH,
                pass: process.env.PASSWORD_AUTH,
            },
        });

        const mailOptions = {
            from: `"Smart - Note" <${process.env.EMAIL_AUTH}>`,
            to: To,
            subject: subject,
            html: html,
        };

        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.error("Error sending email:", error);
                reject(false);
            } else {
                console.log("Message sent:", info.messageId);
                console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
                resolve(true);
            }
        });
    });
};