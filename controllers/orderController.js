const OrderItemsModel = require('../models/orderModel');

const OrderItems = {
    Add: async (req, res) => {
        const methods = req.method;
        switch (methods) {
            case "POST":
                try {
                    const data = req.body.data;
//			console.log("req.body",req.body)
                    const formattedData = await data.map(item => ({
 mwoNumber: item?.mwoNumber,
    cwoNumber: item?.cwoNumber,
    homePassCount: item?.homePassCount,
    totalCwo: item?.totalCwo,
    cosumedCwo: item?.cosumedCwo,
    businessType: item?.businessType,
    catergory:item?.catergory,
    issued:item?.issued,
    lastModified:item?.lastModified,
    circleCity:item?.circleCity,
    startOn:item?.startOn,
    endOn:item?.endOn,
    partner:item?.partner,
    partnerName:item?.partnerName,
    status:item?.status
                    }));
//console.log("dataaaaaaaaa",formattedData)
			for (const item of formattedData) {
                      
                                const itemInsert = await new OrderItemsModel(item);
                                await itemInsert.save()
                           
                    }
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
                    await OrderItemsModel.find().then(async function (items, err) {
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

module.exports = OrderItems;
