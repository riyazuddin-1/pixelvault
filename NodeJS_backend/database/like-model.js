const mongoose = require('mongoose');
const { collections } = require('.');

const likeSchema = new mongoose.Schema({
    content_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Image', 
        required: true 
    },
    liked_by: { 
        type: String, 
        required: true 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    }
}, { collection: collections.likes });

module.exports = mongoose.model('Like', likeSchema);