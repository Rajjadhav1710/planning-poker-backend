const nodemailer = require("nodemailer");

//if text is send , html is ignored
//if html is send , text is ignored
async function sendMail( mailInfo : {
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
}){
    let transporter = nodemailer.createTransport({
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        secure : false,
        auth : {
            user : process.env.SMTP_USER,
            pass : process.env.SMTP_PASS
        }
    });

    //sending mail
    let info = await transporter.sendMail({
        from : `Planning Poker Online ${mailInfo.from}`,
        to : mailInfo.to,
        subject : mailInfo.subject,
        text : mailInfo.text,
        html : mailInfo.html
    });

    console.log(info);
}

module.exports = sendMail;