const express = require('express');
const app = express();

const authentication = require('./authentication');
const imageManagement = require('./image_management');

app.get('/', (req, res) => {
    res.send(`This is backend for ${process.env.ORIGIN}`);
})

app.use('/auth', authentication);

app.use('/images', imageManagement);

module.exports = app;