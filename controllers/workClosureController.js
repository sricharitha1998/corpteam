const nodemailer = require('nodemailer')
const workClosureModel = require('../models/workClosureModel')

const workClosure = {
    CreateDocs : async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    
                    const fileData = req.files.reduce((acc, file) => {
                        acc[file.fieldname] = file.originalname;
                        return acc;
                    }, {});
            
        let others = [];
        if (req.body.others) {
            try {
                others = JSON.parse(req.body.others).map(item => ({
                    key: item.key,
                    value: item.fileName
                }));
            } catch (error) {
                console.error("Error parsing 'others' field:", error);
            }
        }
        console.log("req.body.workOrder_id", req.body.workOrder_id)
                    const closureForm = new workClosureModel({
                        ...fileData,
                        others,
                        vendor_id: req.body.vendor_id,
                        workOrder_id: req.body.workOrder_id
                    });
            
                    closureForm.save().then((details, err) => {
                        if (err) {
                            console.error("Error saving closure form:", err);
                            return res.status(500).json({ msg: "Error saving closure form" });
                        }
                        const transporter = nodemailer.createTransport({
                                service:'gmail',
                                auth:{
                                    user : "corpteamdigital@gmail.com",
                                    pass : "wnemjpfoypeztkds" 
                                }
                            });
                            const url = `http://localhost:3000/approvalForm/${details._id}/level1`
                            const mailOptions = {
                                from : "corpteamdigital@gmail.com",
                                to : "sricharitha1998@gmail.com",
                                subject : `Work Closure Form`,
                                html : `<div><p>work closure form submitted by Vendor1 </p><a href=${url}>View Documents</a></div>`
                            };
                            
                            const VendorOptions = {
                                from : "corpteamdigital@gmail.com",
                                to : "sreecharitha.a@corpteamsolutions.com",
                                subject : 'Submitted Work Closure Form',
                                html : `<h5>All the documents are submitted successfully. Thanks.</h5>`
                            };
                        
                            transporter.sendMail(mailOptions,async function(err,info){
                                if(err){
                                    console.log("err: "+err)
                                }else{
                                    transporter.sendMail(VendorOptions,async function(err,info){
                                        if(err){
                                            console.log("err: "+err)
                                        }else{
                                            // console.log("info", info)
                                        }
                                    })
                                }
                            })

                            return res.json({ status: true, details });
                        });
                    
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }   
    }, 

    getwcfs: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    await workClosureModel.find({vendor_id: req.params.id}).then(function (doc, err) {
                        if (err) {
                            console.log("err", err);
                            return next(err);
                        }
                        return res.status(200).json({ wcfs: doc });
                        
                    });
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }
    },

    getDocuments: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    await workClosureModel.findOne({_id:req.params.id}).then(function (doc, err) {
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

    SendEmailVendor: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                // try {
                //     const { id } = req.params;
                //     const { approvals } = req.body;
            
                //     const document = await workClosureModel.findById(id);
            
                //     if (!document) {
                //         return res.status(404).json({ msg: 'Document not found' });
                //     }
            
                //     const parsedApprovals = JSON.parse(approvals).map(item => ({
                //         key: item.key,
                //         value: item.fileName, 
                //         status: item.status 
                //     }));
            
                //     const allApproved = parsedApprovals.every(approval => approval.status === 'Approved');
                    
                //     if (allApproved) {
                //         await workClosureModel.findByIdAndUpdate(id, { level1: 'approved', approvals: parsedApprovals });
            
                //         const transporter = nodemailer.createTransport({
                //             service: 'gmail',
                //             auth: {
                //                 user: 'corpteamdigital@gmail.com',
                //                 pass: 'wnemjpfoypeztkds'
                //             }
                //         });
            
                //         const url = `http://localhost:3000/approvalForm/${id}/level2`;
            
                //         const mailOptions = {
                //             from: 'corpteamdigital@gmail.com',
                //             to: 'sricharitha1998@gmail.com',
                //             subject: 'Work Closure Form',
                //             html: `<div><p>Work closure form submitted by Vendor1</p><a href=${url}>View Documents</a></div>`
                //         };
            
                //         transporter.sendMail(mailOptions, (err, info) => {
                //             if (err) {
                //                 console.error('Error sending email:', err);
                //             } else {
                //                 console.log('Email sent:', info.response);
                //             }
                //         });
            
                //         res.json({ msg: 'Email sent and document updated successfully' });
                //     } else {
                //         res.status(400).json({ msg: 'Approval is not completed. Please complete the approval process.' });
                //     }
                // } catch (error) {
                //     await workClosureModel.findByIdAndUpdate(id, { level1: 'rejected' });
                //     console.error('Error handling form submission:', error);
                //     res.status(200).json({ msg: 'Rejected' });
                // }

                try {
                    const { approvals, level, id } = req.body;
                    const document = await workClosureModel.findById(id);
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

                    await workClosureModel.findByIdAndUpdate(id, updateFields);
                    
                    if (allApproved && (level === "level1" || level==="level2")) {

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: { 
                                user: 'corpteamdigital@gmail.com',
                                pass: 'wnemjpfoypeztkds'
                            }
                        });
                        
                        const url = `http://localhost:3000/approvalForm/${id}/${level === 'level1' ? 'level2' : `${level === 'level2' && 'level3' }`}`;
            
                        const mailOptions = {
                            from: 'corpteamdigital@gmail.com',
                            to: 'sricharitha1998@gmail.com',
                            subject: 'Work Closure Form',
                            html: `<div><p>Work closure form submitted by Vendor1</p><a href=${url}>View Documents</a></div>`
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

    UpdateDocs: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "PATCH": 
                try {
                    const fileData = req.files.reduce((acc, file) => { 
                        acc[file.fieldname] = file.originalname;
                        return acc;
                    }, {});
                    fileData.level1 = "";
                    fileData.level2 = "";
                    fileData.level3 = "";
                    const document = await workClosureModel.findByIdAndUpdate(req.params.id, fileData);
                    if (!document) {
                        return res.status(404).json({ msg: 'Document not found' });
                    }             
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'corpteamdigital@gmail.com',
                                pass: 'wnemjpfoypeztkds'
                            }
                        });
            
                    const url = `http://localhost:3000/approvalForm/${req.params.id}/level1`
                            const mailOptions = {
                                from : "corpteamdigital@gmail.com",
                                to : "sricharitha1998@gmail.com",
                                subject : `Work Closure Form`,
                                html : `<div><p>work closure form submitted by Vendor1 </p><a href=${url}>View Documents</a></div>`
                            };
            
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.error('Error sending email:', err);
                            } else {
                                console.log('Email sent:', info.response);
                            }
                        });
                    
            
                    res.json({ msg: 'Document updated successfully' });
                } catch (error) {
                    console.error('Error handling form submission:', error);
                    res.status(500).json({ msg: 'Server error' });
                }
        }

    },
    
};

module.exports = workClosure; 

