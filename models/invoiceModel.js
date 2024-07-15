const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    wcf: String,
    invoiceCopy: String,
    supportingDoc: String,
    vendor_id: String,
    approval: String,
    level1: String,
    level2: String,
    level3: String,
    approvals: Array
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
