import nodemailer, { SentMessageInfo } from "nodemailer";

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

        transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
            if (error) {
                console.error("Error sending email:", error.message);
                reject(false);
            } else {
                console.log("✅ Message sent:", info.messageId);

                // This function only works with Ethereal Email (used for testing)
                const previewUrl = nodemailer.getTestMessageUrl(info);
                if (previewUrl) {
                    console.log("🔍 Preview URL:", previewUrl);
                }

                resolve(true);
            }
        });
    });
};