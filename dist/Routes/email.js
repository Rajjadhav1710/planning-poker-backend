"use strict";
const router = require('express').Router();
const path = require('path');
router.post("/", (req, res) => {
    const { roomPageLink, emailTo, emailFrom } = req.body;
    //validate request
    if (!roomPageLink || !emailTo || !emailFrom) {
        return res.status(422).json({ error: "All Fields Are Required." });
        // 422 Unprocessable Content
    }
    //send email
    //sendMail is an async method
    const sendMail = require(path.join(__dirname, "..", "Services", "email.service"));
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "Invitation for planning poker session",
        text: "text",
        html: require(path.join(__dirname, "..", "Templates", "email.template"))({
            emailFrom: emailFrom,
            link: roomPageLink
        })
    });
    return res.send({ success: true });
});
module.exports = router;
