const express = require('express');
const app = express();

const controllers = require('../controllers').mailManagement;

app.post('/send-mail', controllers.sendEmail);

module.exports = app;