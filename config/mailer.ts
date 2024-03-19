import nodemailer, { Transporter } from 'nodemailer';
import { EMAIL_TEST, EMAIL_TEST_APP } from '../secret';

interface MailOptions {
    from: {
        name: string;
        address: string;
    };
    to: string;
    subject: string;
    html?: string | { path: string };
}

const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_TEST,
        pass: EMAIL_TEST_APP
    }
});

async function sendEmail(subject: string, recipient: string, url = '', htmlBody = ''): Promise<any> {
    const mailOptions: MailOptions = {
        from: {
            name: 'BRYAN BACKEN TEST',
            address: EMAIL_TEST
        },
        to: recipient,
        subject: subject,
    };

    if (url) {
        mailOptions.html = { path: url };
    }

    if (htmlBody) {
        mailOptions.html = htmlBody;
    }

    const send = await transporter.sendMail(mailOptions);
    return send;
}

export default sendEmail;