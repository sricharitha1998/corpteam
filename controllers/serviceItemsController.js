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
};

module.exports = ServiceItems;
