const serviceItemsModel = require('../models/serviceItemModel');

const ServiceItems = {
    register: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const data = req.body; // The array of objects sent from the frontend

                    // Map the data to the structure required by the model
                    const formattedData = data.map(item => ({
                        uom: item?.uom,
                        code: item?.code,
                        description: item?.description
                    }));

                    // Insert all items in a single operation
                    await serviceItemsModel.insertMany(formattedData);

                    // Respond back to the frontend
                    res.status(200).json({ success: true, message: 'Items successfully inserted' });

                } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                }
                break;

            default:
                res.status(405).json({ success: false, message: 'Method not allowed' });
                break;
        }
    },
    getItems: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "GET":
                try {
                    await serviceItemsModel.find().then(async function (items, err) {
                        if (err) {
                            res.json(err)
                        } else {
                            return res.status(200).json(items);
                        }
                    })
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }

    },
    singleInsert: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    //console.log("req.body", req.body);
const uom = req.body.uom;
                    const description = req.body.description;
                    const code = req.body.code;

                    await serviceItemsModel.findOne({ code }).then(function (existingUser, err) {
                        if (existingUser) {
                            return res.json({ message: 'That code is already in use.', status: false });
                        }

<<<<<<< HEAD
                         const itemInsert = new serviceItemsModel({
=======
                        const itemInsert = new serviceItemsModel({
>>>>>>> 916b5900501a490b4c4d1248c45e850a39b91176
                            code, description, uom
                        });
                        itemInsert.save().then(async (item, err) => {
                          
                            return res.json({ status: true, item });                            
                        });
                    })
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }

    },
};

module.exports = ServiceItems;
