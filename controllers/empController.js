const EmpModel = require('../models/EmployeeModel');
const md5 = require('md5');
const MailFunction = require('./mailFunction')

const employee = {

    registration: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const { email, MobNumber, empID, password } = req.body;
                    const hashedPassword = md5(password);
                    const role = "employee";
                    const status = 1;

                    const existingUser = await EmpModel.findOne({ email });
                    if (existingUser) {
                        return res.json({ message: 'That email address is already in use.', status: false });
                    }

                    const newEmployee = new EmpModel({
                        email,
                        password: hashedPassword,
                        MobNumber,
                        empID,
                        role,
                        status,
                    });

                    const details = await newEmployee.save();
			const url = `https://pms.corpteamsolution.com/EmpLogin`
	let HtmlMsg = `<div><p><b>Employee account is created successfully.</b> <br /> Check the below credentials: <br /> <b>Employee ID:</b> ${req.body.empID} <br/> <b>Email:</b> ${req.body.email} <br /> <b>Password:</b>  ${req.body.password}<br /> <a href=${url}>Click here to login</a> </p></div>`;
                            let subject="Employee account created successfully";
                            let toMail = req.body.email;
                            let SendToMail = "projects@corpteamsolutions.com";
                            await MailFunction(HtmlMsg, subject, SendToMail)
                            await MailFunction(HtmlMsg, subject, toMail)                   
			
 return res.json({ status: true, details });

                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }
    },

    getEmployees: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    const employees = await EmpModel.find();
                    return res.status(200).json({ employees });
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
                    if (!email || !password || !role) {
                        return res.status(400).json({ msg: "Not all fields have been entered" });
                    }

                    const details = await EmpModel.findOne({ email, password: md5(password), role });
                    if (!details) {
                        return res.status(400).json({ msg: "No account with these details has been registered/Active" });
                    }
                    return res.json({ status: 200, details });

                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }
    },

};

module.exports = employee;
