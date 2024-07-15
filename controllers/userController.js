const userModel = require('../models/userModel')
const md5 = require('md5');
const JWT = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const user = {

    registration: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {

                    const email = req.body.email;
                    const MobNumber = req.body.MobNumber;
                    const username = req.body.username;
                    const password = md5(req.body.password);
                    const role = req.body.role;
                    const status = req.body.status;
                    
                    if (!email) {
                        return res.status(422).send({ error: 'You must enter an email address.' });
                    }

                    if (!MobNumber || !username) {
                        return res.status(422).send({ error: 'You must enter your Name.' });
                    }

                    if (!password) {
                        return res.status(422).send({ error: 'You must enter a password.' });
                    }

                    if (!role) {
                        return res.status(422).send({ error: 'Enter all fields.' });
                    }

                    userModel.findOne({ email }).then(function (existingUser, err) {
                        if (existingUser) {
                            return res.json({ message: 'That email address is already in use.', status: false });
                        }

                        const user = new userModel({
                            email,
                            password,
                            MobNumber,
                            username,
                            role,
                            status,
                        });
                        user.save().then((user, err) => {
                            if (err) { return console.log(err); }
                            return res.json({ status: true, user });
                        });
                    })
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }

    },

    login: async (req, res) => {

        const methods = req.method;
        switch (methods) {
            case "POST":

                try {
                    const { email, password, role } = req.body;
                    if (!email && !password && !role) {
                        return res.status(400).json({ msg: "Not all fields have been entered" });
                    }

                    await userModel.findOne({ "email": email, "password": md5(password), status: 1, "role": role }).then(function (details, err) {
                        if (!details) {
                            return res.status(400).json({ msg: "No account with this details has been registered/Active" });
                        } else {
                            const accessToken = JWT.sign({
                                email: details.email,
                                role: details.role,
                                id: details._id,
                                password: details.password
                            }, "corpteam", {
                                expiresIn: "1d"
                            });

                            const refreshToken = JWT.sign({
                                email: details.email,
                                role: details.role,
                                id: details._id,
                            }, "corpteam", {
                                expiresIn: "1d"
                            })

                            res.cookie('jwt', accessToken, {
                                httpOnly: true,
                                sameSite: 'None', secure: false,
                                maxAge: 24 * 60 * 60 * 1000
                            });
                            return res.json({ accessToken: accessToken, refreshToken: refreshToken, details: details })
                        }
                    })
                }
                catch (err) {
                    return res.status(500).json({ msg: err.message });
                }


        }
    },

    SendOTP: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    await userModel.findOne({ email: req.body.email }).then(function (doc, err) {
                        if(!doc){
                            return res.status(401).json({ status: false, msg: "Vendor not registered with this email" }); 
                        }
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: "corpteamdigital@gmail.com",
                            pass: "wnemjpfoypeztkds"
                        }
                    });

                    const randomOTP = Math.floor(100000 + Math.random() * 900000);

                    const mailOptions = {
                        from: "corpteamdigital@gmail.com",
                        to: req.body.email,
                        subject: "Reset Password",
                        html: `<div><p>OTP: ${randomOTP}</p></div>`
                    };

                    transporter.sendMail(mailOptions, async function (err, info) {
                        if (err) {
                            console.log("err: " + err)
                        } else {
                            console.log("info", info)
                        }
                    })
                    res.json({ status: 200, OTP: randomOTP });
                });
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }
    },

    changePassword: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    await userModel.findOneAndUpdate({ email: req.body.email }, { password: md5(req.body.password) }, { upsert: true }).then(function (doc, err) {
                        if (err) {
                            console.log("err", err);
                            return next(err);
                        }
                        res.json(doc);
                    });
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }

    },

    getUsers: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    await userModel.find({ role: req.params.role }).then(async function (users, err) {
                        if (err) {
                            res.json(err)
                        } else {
                            return res.status(200).json({ users: users });
                        }
                    })
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }

    },

    changeProfile: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    await userModel.findOneAndUpdate({ _id: req.params.id },  req.body, { upsert: true }).then(function (doc, err) {
                        if (err) {
                            console.log("err", err);
                            return next(err);
                        }
                        res.json(doc);
                    });
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }

    },

    getById: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    await userModel.findOne({ _id: req.params.id }).then(function (doc, err) {
                        if (err) {
                            console.log("err", err);
                            return next(err);
                        }
                        res.json(doc);
                    });
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }

    },
};

module.exports = user; 
