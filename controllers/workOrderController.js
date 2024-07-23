const workOrderModel = require('../models/workOrderModel')
const WorkClosureModel = require('../models/workClosureModel')

const WorkOrder = {
    InsertRecords: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const OrdersForm = new workOrderModel({
                        services: req.body.services,
                        workOrderNumber: req.body.workOrderNumber,
                        buildingArea: req.body.buildingArea,
                        vendor_id: req.body.vendorID,
                        date: req.body.date,
                        homePass: req.body.homePass,
                        routeLength: req.body.routeLength,
                        status: req.body.status,
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
                    await workOrderModel.findByIdAndUpdate({ _id: req.body.id }, { vendor_id: req.body.vendor_id, status:null, date: new Date() }, { upsert: true }).then(function (doc, err) {
                       
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

    getOrderRecord: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    await workOrderModel.findOne({
                        workOrderNumber: { $regex: new RegExp(`^${req.body.workOrderNumber}$`, 'i') },
                        buildingArea: { $regex: new RegExp(`^${req.body.buildingArea}$`, 'i') }
                    }).then(async function (docs, err) {
                        
                        if (err) {
                            console.log("err", err);
                            return next(err);
                        }
                        if(docs){
                            if(docs?.status == "accept"){
                            await WorkClosureModel.findOne({vendor_id: req.body.vendor_id, workOrder_id: docs?._id }).then(function (data, err) {
                                if(data){
                                    return res.status(400).json({status: 400, msg: "Vendor Already Filled The Work closure Form"});
                                }else{
                                    return res.status(200).json({status: 200, msg: "Vendor Proceed To Apply", workOrderId: docs?._id});
                                }
                            })
                        }else{
                            return res.status(400).json({status: 400, msg: "Not Accepted The Work Order"});
                        }   
                    }else{
                        return res.status(400).json({status: 400, msg: "Work Order Is Not Registered With Below Details"});
                    }                     
                         
                    });
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }
    },
};

module.exports = WorkOrder;

