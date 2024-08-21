const supplyItemsModel = require('../models/supplyItemsModel');

const SupplyItems = {
    register: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                   
                    const result = await supplyItemsModel.insertMany(data);
                    console.log('Data inserted successfully:', result);
                    

                } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                }
        }

    },
};

module.exports = SupplyItems; 
