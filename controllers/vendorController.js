const vendorModel = require('../models/vendorModel');

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
                        vendorCode: req.body.code,
                        // aoe: req.body.aoe,
                        companyDetails: req.body.companyDetails,
                        dateTime: req.body.dateTime,
                        vendor_id: req.body.vendor_id,
                        gst: req.body.gst,
                        address: req.body.address,
                        companyTeam: req.body.companyTeam
                    };

                    const VendorRegister = new vendorModel({
                        ...fileData,
                        ...vendorData,
                    });

                    VendorRegister.save().then((details, err) => {
                        if (err) {
                            return res.status(500).json({ msg: "Error saving closure form" });
                        }
                        res.json({ success: true, details: details });
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

};

module.exports = Vendor; 
