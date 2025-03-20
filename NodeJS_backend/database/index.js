const mongoose = require('mongoose');

let uri = process.env.DATABASE_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected successfully to server');
});

// Collection names
const collections = {
    'users': 'users',
    'images': 'images',
    'temporary': 'temporary',
    'likes': 'likes'
}

module.exports = { mongoose, collections };