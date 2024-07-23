const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../model/User.js');

const generateRandomPassword = () => {
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let password = ''
    for(let i = 0; i < 4; i++ ){
        password += char.charAt(Math.floor(Math.random() * char.length));
    }
    return password;
}
const sendEmail = (req, res) => {
    const email = req.body.email;
    const user = User.findOne({ email: email });
    if (!user) return res.status(401).json({ "message": "No user found for this email" });

    const password = generateRandomPassword();
    const hash = bcrypt.hash(password, 10);
    user.password = hash;
    user.save();
    let transportMail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    let mailContent = {
        from: process.env.EMAIL,
        to: email,
        subject: 'New Password Request',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Password</title>
            <style>
                h1, span{
                    color: #1db954;
                }
                header, main{
                    display: flex;
                    justify-content: start;
                    align-items: center;
                }
                .box{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    border-radius: 7px;
                    background: hsl(0, 5%, 5%);
                }
                main:first-child{
                    color: white;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>Request for New Password</h1>
            </header>
            <main>
                <span>
                    New Password: 
                </span>
                <span class="box">
                    ${password}
                </span>
            </main>
        </body>
        </html>
        `
    }

    transportMail.sendMail(mailContent, (err, val) => {
        if(err){
            res.status(500).json({"message": err});
            console.log(err);
        } else {
            res.sendStatus(200);
        }
    })
}

module.exports = {sendEmail}