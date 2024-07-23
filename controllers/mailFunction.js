const nodemailer = require('nodemailer')
const MailFunction = async (HtmlMsg, subject, toMail) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'corpteamdigital@gmail.com',
                pass: 'wnemjpfoypeztkds'
            }
        });

        const mailOptions = {
            from: "corpteamdigital@gmail.com",
            to: toMail,
            subject: subject,
            html: HtmlMsg
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { status: 200, msg: 'Email sent', info };
    } catch (error) {
        console.error('Error handling form submission:', error);
        res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = MailFunction; 