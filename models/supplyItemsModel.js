const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupplyItemsSchema = new Schema({
   code: String,
   description: String,
   uom: String
});

module.exports = mongoose.model('SupplyItem', SupplyItemsSchema);
