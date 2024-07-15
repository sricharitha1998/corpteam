const InvoiceModel = require('../models/invoiceModel');
const nodemailer = require('nodemailer');

const Invoice = {
    register: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const fileData = req.files.reduce((acc, file) => {
                        acc[file.fieldname] = file.originalname;
                        return acc;
                    }, {});

                        const Invoice = new InvoiceModel( {...fileData, vendor_id: req.body.vendor_id} );
                
                        Invoice.save().then((details, err) => {
                            if (err) {
                                return res.status(500).json({ msg: "Error saving closure form" });
                            }

                            const transporter = nodemailer.createTransport({
                                service:'gmail',
                                auth:{
                                    user : "corpteamdigital@gmail.com",
                                    pass : "wnemjpfoypeztkds" 
                                }
                            });
                            const url = `http://localhost:3000/invoiceApproval/${details._id}/level1`
                            const mailOptions = {
                                from : "corpteamdigital@gmail.com",
                                to : "sricharitha1998@gmail.com",
                                subject : `Invoice Form`,
                                html : `<div><p>Invoice form submitted by Vendor1 </p><a href=${url}>View Documents</a></div>`
                            };
                            
                            transporter.sendMail(mailOptions,async function(err,info){
                                if(err){
                                    console.log("err: "+err)
                                }else{
                                    console.log("info", info)
                                }
                            })

                            return res.json({ success: true, details });
                        })
                
                        
                    } catch (error) {
                        res.status(500).json({ success: false, message: error.message });
                    }
        }

    },

    getDocuments: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    await InvoiceModel.findOne({_id:req.params.id}).then(function (doc, err) {
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

    getAllRecords: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    await InvoiceModel.find({vendor_id: req.params.id}).then(function (doc, err) {
                        if (err) {
                            console.log("err", err);
                            return next(err);
                        }
                        return res.status(200).json({ invoices: doc });
                        
                    });
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }
    },

    SendEmail: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const { approvals, level, id } = req.body;
                    const document = await InvoiceModel.findById(id);
                    
                    if (!document) {
                        return res.status(404).json({ msg: 'Document not found' });
                    }
                    
                    const parsedApprovals = JSON.parse(approvals).map(item => ({
                        key: item.key,
                        comments: item.comments, 
                        status: item.status 
                    }));
                    const allApproved = parsedApprovals.every(approval => approval.status === 'Approved');
                   
                    let updateFields = {};
                    if (allApproved) {
                        updateFields = {
                            [level]: 'approved',
                            approvals: parsedApprovals
                        };
                    } else {
                        updateFields = {
                            [level]: 'rejected',
                            approvals: parsedApprovals
                        };
                    }
                    
                    await InvoiceModel.findByIdAndUpdate(id, updateFields);
                    
                    if (allApproved && (level === "level1" || level==="level2")) {

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: { 
                                user: 'corpteamdigital@gmail.com',
                                pass: 'wnemjpfoypeztkds'
                            }
                        });
                        
                        const url = `http://localhost:3000/invoiceApproval/${id}/${level === 'level1' ? 'level2' : `${level === 'level2' && 'level3' }`}`;
            
                        const mailOptions = {
                            from: 'corpteamdigital@gmail.com',
                            to: 'sricharitha1998@gmail.com',
                            subject: 'Invoice Form',
                            html: `<div><p>Invoice form submitted by Vendor1</p><a href=${url}>View Documents</a></div>`
                        };
            
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.error('Error sending email:', err);
                            } else {
                                console.log('Email sent:', info.response);
                            }
                        });
                    }
            
                    res.json({ msg: 'Document updated successfully' });
                } catch (error) {
                    console.error('Error handling form submission:', error);
                    res.status(500).json({ msg: 'Server error' });
                }
        }

    },
};

module.exports = Invoice; 
