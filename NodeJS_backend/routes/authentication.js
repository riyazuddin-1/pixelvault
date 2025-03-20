const express = require('express');
const app = express();

const controllers = require('../controllers').auth;

app.post('/login', controllers.login);

app.post('/register', controllers.register);

app.post('/profile', controllers.getUserDetails);

app.post('/update-profile', controllers.updateUserDetails);

app.post('/check-username', controllers.checkUsername);

app.post('/update-password', controllers.updatePassword);

app.post('/verify-email', controllers.verifyEmail);

app.post('/verify-otp', controllers.verityOtp);

module.exports = app;