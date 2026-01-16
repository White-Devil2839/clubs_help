const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ email, subject, message, html }) {
    try {
        const msg = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject,
            html: html || `<p>${message}</p>`,
        };
        const response = await sgMail.send(msg);
        console.log("Email sent:", response[0].statusCode);
        return true;
    } catch (error) {
        console.error("SendGrid error:", error);
        if (error.response) {
            console.error(JSON.stringify(error.response.body, null, 2));
        }
        return false;
    }
}

module.exports = sendEmail;
