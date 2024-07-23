const vendorModel = require('../models/vendorModel');
const userModel = require('../models/userModel');
const MailFunction = require('./mailFunction');

const Vendor = {
    register: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const fileData = req.files.reduce((acc, file) => {
                    acc[file.fieldname] = file.originalname;
                    return acc;
                }, {});

                    const vendorData = {
                        vendorCode: req.body?.code,
                        // aoe: req.body.aoe,
                        companyDetails: req.body?.companyDetails,
                        dateTime: req.body?.dateTime,
                        vendor_id: req.body?.vendor_id,
                        gst: req.body?.gst,
                        address: req.body?.address,
                        companyTeam: req.body?.companyTeam,
                    };

                    const VendorRegister = new vendorModel({
                        ...fileData,
                        ...vendorData,
                    });

                    VendorRegister.save().then(async (details, err) => {
                        if (err) {
                            return res.status(500).json({ msg: "Error saving closure form" });
                        }

                        await userModel.findOneAndUpdate({ _id: req.body?.vendor_id },  {ProfileStatus: "1"}, { upsert: true }).then(function(doc, err) {
                            if (err) {
                                console.log("err", err);
                                return next(err);
                            }
                            const url = `http://localhost:3000/VendorApproval/${details._id}`
                            let HtmlMsg = `<div><p>Approve the ${doc?.username} service partner registration documents: <br /> <a href=${url}>View Documents</a> </p></div>`;
                            let subject="Approve Documents For Registration";
                            let toMail = req.body.email;
                            let SendToMail = "sricharitha1998@gmail.com";
                            MailFunction(HtmlMsg, subject, SendToMail)
                            res.json(doc);
                        });
                       
                    })

                } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                }
        }

    },

    VendorDetails: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    const vendorDetails = await vendorModel.findOne({ _id: req.params.id });
                    res.json({ success: true, details: vendorDetails });
                } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                }
        }
    },

    GetDetails: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    const vendorDetails = await vendorModel.findOne({ vendor_id: req.params.vendorID });
                    res.json({ success: true, details: vendorDetails });
                } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                }
        }
    },

    UpdateProfile: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    await vendorModel.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true }).then(function (doc, err) {
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
    UpdateApproval: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const { approvals, id } = req.body;
                    const document = await vendorModel.findById(id);
                    
                    if (!document) {
                        return res.status(404).json({ msg: 'Document not found' });
                    }
                    
                    const parsedApprovals = JSON.parse(approvals).map(item => ({
                        key: item.key,
                        comments: item.comments, 
                        status: item.status 
                    }));
                    
                    let updateFields = {
                        approvals: parsedApprovals
                    };
                                        
                    await vendorModel.findByIdAndUpdate(id, updateFields);
                    
                    res.json({ msg: 'Document updated successfully' });
                } catch (error) {
                    console.error('Error handling form submission:', error);
                    res.status(500).json({ msg: 'Server error' });
                }
        }

    },
};

module.exports = Vendor; 
