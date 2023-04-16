"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const nodemailer = require("nodemailer");
//if text is send , html is ignored
//if html is send , text is ignored
function sendMail(mailInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        //sending mail
        let info = yield transporter.sendMail({
            from: `Planning Poker Online ${mailInfo.from}`,
            to: mailInfo.to,
            subject: mailInfo.subject,
            text: mailInfo.text,
            html: mailInfo.html
        });
        console.log(info);
    });
}
module.exports = sendMail;
