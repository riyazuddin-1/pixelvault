var controllers = {};

controllers.auth = require('./authentication');

controllers.imageManagement = require('./image_management');

controllers.mailManagement = require('./mail');

module.exports = controllers;