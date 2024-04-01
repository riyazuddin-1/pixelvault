const express = require('express');
const app = express();

const controllers = require('../controllers').imageManagement;

app.post('/get-images', controllers.getImages);

app.post('/explore-images', controllers.exploreImages);

app.post('/upload-image', controllers.uploadImage);

app.post('/delete-image', controllers.deleteImage);

module.exports = app;