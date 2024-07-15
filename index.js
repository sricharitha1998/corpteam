const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: true}));
require('./DB/conn');
const userModel = require('./models/userModel');
const md5 = require('md5');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '5000mb' }));
const path = require('path');
app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

const PORT = 4000;

const users = require('./routes/userRoute');
app.use('/users/', users);

const workClosure = require('./routes/workClosureRoute');
app.use('/workClosure/', workClosure);

const vendor = require('./routes/vendorRoute');
app.use('/vendor/', vendor);

const invoice = require('./routes/invoiceRoute');
app.use('/invoice/', invoice);

const workOrder = require('./routes/workOrderRoute');
app.use('/workOrder/', workOrder);

app.get('/public/documents/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', 'documents', filename);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.log(err);
            res.status(404).send('File not found');
        }
    });
});

app.get('/public/invoice/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', 'invoice', filename);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.log(err);
            res.status(404).send('File not found');
        }
    });
});

app.listen(PORT, async function (res) { 
    console.log(`server started at ${PORT}`);
    const adminDetails = {
        email: 'admin@gmail.com',
        role: "admin",
        password: md5("123456"),
        username: "Admin",
        status: 1
    };

    const existingUser = await userModel.findOne({ email: adminDetails.email });

    if (!existingUser) {
        const user = new userModel(adminDetails); 
        await user.save();
        console.log("Admin user created successfully");
    } else {
        console.log("Admin already exists");
    }
})
 