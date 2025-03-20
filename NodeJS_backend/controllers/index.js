let controllers = {};

controllers.auth = require('./authentication');

controllers.imageManagement = require('./image_management');

module.exports = controllers;