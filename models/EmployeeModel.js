const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const EmpSchema = new Schema({
    email: String,
    password: String,
    MobNumber: String,
    empID: String,
    role: String,
    status:Number,
});

module.exports = mongoose.model('Employee', EmpSchema);
