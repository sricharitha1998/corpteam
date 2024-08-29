const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkOrderSchema = new Schema({
    workOrderNumber: String,
    buildingArea: String,
    vendor_id: String,
    services: Array,
    supplies: Array,
    status: String,
    date: String,
    homePass: String,
    routeLength: String,
	supplyTotalRate: String,
    serviceTotalRate: String
});
 
module.exports = mongoose.model('WorkOrder', WorkOrderSchema);
