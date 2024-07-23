const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    MobNumber: Number,
    username: String,
    role: {
        type: String,
        required: true
    },
    status:Number,
    ProfileStatus: String
});

module.exports = mongoose.model('User', UserSchema);
