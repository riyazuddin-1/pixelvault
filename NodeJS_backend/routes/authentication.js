const express = require('express');
const app = express();

const controllers = require('../controllers').auth;

app.post('/login', controllers.login);

app.post('/register', controllers.register);

app.post('/user-details', controllers.getUserDetails);

app.post('/check-username', controllers.checkUsername);

app.post('/change-password', controllers.changePassword);

app.post('/create-special-password', controllers.createSpecialPassword);

app.post('/check-special-password', controllers.checkSpecialPassword);

module.exports = app;