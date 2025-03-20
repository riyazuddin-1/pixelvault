const mongoose = require('mongoose');
const { collections } = require('.');

const temporarySchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        lowercase: true 
    },
    verified: { 
        type: Boolean, 
        default: false 
    },
    otp: { 
        type: String, 
        required: true 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    }
}, {collection: collections.temporary});

module.exports = mongoose.model('Temporary', temporarySchema);