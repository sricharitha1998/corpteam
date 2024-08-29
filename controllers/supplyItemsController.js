const supplyItemsModel = require('../models/supplyItemsModel');

const SupplyItems = {
    register: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const data = req.body; // The array of objects sent from the frontend

                    // Map the data to the structure required by the model
                    const formattedData = await data.map(item => ({
                        uom: item?.uom,
                        code: item?.code,
                        description: item?.description
                    }));

                    // Insert all items in a single operation
                    //await supplyItemsModel.insertMany(formattedData);
			for (const item of formattedData) {
                        await supplyItemsModel.findOne({ code: item?.code }).then(async function (existingCode, err) {
                            if (!existingCode) {
                                const itemInsert = await new supplyItemsModel(item);
                                await itemInsert.save()
                            }
                        })
                    }
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
                    await supplyItemsModel.find().then(async function (items, err) {
                        console.log("items", items);
console.log("err", err)
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
                    const uom = req.body.uom;
                    const description = req.body.description;
                    const code = req.body.code;

                    await supplyItemsModel.findOne({ code }).then(async function (existingUser, err) {
 if (!existingUser) {
                            const itemInsert = new supplyItemsModel({
                                code, description, uom
                            });
                            await itemInsert.save().then(async (item, err) => {
                              
                                return res.json({ status: true, item });
                                
                            });
                        }else{
return res.json({ status: false, item });
}                     
                    })
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
        }

    },
};

module.exports = SupplyItems;
