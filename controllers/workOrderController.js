const nodemailer = require('nodemailer')
const workOrderModel = require('../models/workOrderModel')

const WorkOrder = {
    InsertRecords: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const OrdersForm = new workOrderModel({
                        services: req.body.services,
                        workOrderNumber: req.body.workOrderNumber,
                        buildingName: req.body.buildingName,
                        vendor_id: req.body.vendorID,
                        status: req.body.status
                    });

                    OrdersForm.save().then((details, err) => {
                        if (err) {
                            console.error("Error saving closure form:", err);
                            return res.status(500).json({ msg: "Error saving closure form" });
                        }
                       
                        return res.json({ status: true, details });
                    });

                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }
    },
    getRecords: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    await workOrderModel.find({vendor_id: req.params.id}).then(function (docs, err) {
                        if (err) {
                            console.log("err", err);
                            return next(err);
                        }
                        return res.status(200).json(docs);
                         
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
                    await workOrderModel.find().then(function (docs, err) {
                        if (err) {
                            console.log("err", err);
                            return next(err);
                        }
                        return res.status(200).json(docs);
                         
                    });
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        } 
    },
    getOneRecord: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    await workOrderModel.findOne({_id: req.params.id}).then(function (docs, err) {
                        if (err) {
                            console.log("err", err);
                            return next(err);
                        }
                        return res.status(200).json(docs);
                         
                    });
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }
    },
    UpdateStatus: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    await workOrderModel.findByIdAndUpdate({ _id: req.body.id }, { status: req.body.status }, { upsert: true }).then(function (doc, err) {
                       
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

    UpdateVendor: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    await workOrderModel.findByIdAndUpdate({ _id: req.body.id }, { vendor_id: req.body.vendor_id }, { upsert: true }).then(function (doc, err) {
                       
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

module.exports = WorkOrder;

