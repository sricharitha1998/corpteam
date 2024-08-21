const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceItemsSchema = new Schema({
   code: String,
   description: String,
   uom: String
});

module.exports = mongoose.model('ServiceItem', ServiceItemsSchema);
