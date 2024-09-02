const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    mwoNumber: String,
    cwoNumber: String,
    homePassCount: String,
    totalCwo: String,
    cosumedCwo: String,
    businessType:String,
    catergory:String,
    issued:String,
    lastModified:String,
    circleCity:String,
    startOn:String,
    endOn:String,
    partner:String,
    partnerName:String,
    status:String
});

module.exports = mongoose.model('Order', OrderSchema);
