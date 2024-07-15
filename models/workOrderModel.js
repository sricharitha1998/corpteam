const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkOrderSchema = new Schema({
    workOrderNumber: String,
    buildingName: String,
    vendor_id: String,
    services: Array,
    status: String
});
 
module.exports = mongoose.model('WorkOrder', WorkOrderSchema);
