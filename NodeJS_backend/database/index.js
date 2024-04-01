const { MongoClient } = require('mongodb');

var uri = process.env.DATABASE_URL;

const client = new MongoClient(uri);
client.connect().then(() => {
    console.log('Connected successfully to server');
}).catch(e => {
  console.log(e);
})

const db = client.db('Tasvir_v2');

// Collection names in MongoDB
const collections = {
    'users': 'users',
    'images': 'images'
}

module.exports = { db, collections };