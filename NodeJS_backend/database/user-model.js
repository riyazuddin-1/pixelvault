const mongoose = require('mongoose');
const { collections } = require('.');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    about: { type: String, required: true },
    uid: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { type: String, required: true },
    picture: { type: String, default: null },
    picture_id: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {collection: collections.users});

module.exports = mongoose.model('User', userSchema);