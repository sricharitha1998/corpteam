const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const WorkClosureSchema = new Schema({
    signup: String,
    mrc: String, 
    nesa: String,
    inventory: String, 
    signupABD: String,
    officalApp:String,
    dd: String,
    finalOrder: String,
    officalDemandNote: String,
    approval: String,
    level1: String,
    level2: String,
    level3: String,
    others: Array, 
    vendor_id: String,
    po: String,
    approvals: Array,
    civilSignOff: String,
    sdOrBg: String
});
 
module.exports = mongoose.model('WorkClosure', WorkClosureSchema);
