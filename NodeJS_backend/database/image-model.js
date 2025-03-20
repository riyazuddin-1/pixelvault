const mongoose = require('mongoose');
const { collections } = require('.');

const imageSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    categories: { type: [String], required: true },
    published: { type: Boolean, required: true },
    folder_id: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema, collections.images);