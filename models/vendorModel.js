const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenorSchema = new Schema({
    vendorCode: String,
    // email: String,
    roc: String,
    photo: String,
    // aoe: String,
    // registrationDoc:String,
    partnerShip:String,
    pancard:String,
    // aadhaar:String,
    companyDetails:String,
    financialDetails:String,
    dateTime:String,
    // phone:String,
    vendor_id:String,
    address: String,
    gst: String,
    companyTeam: String,
    approvals: Array
});

module.exports = mongoose.model('VendorDetail', VenorSchema);
