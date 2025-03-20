const express = require('express');
const { authorizationCheck, authorizationGuard } = require('../middlewares');
const app = express();

const controllers = require('../controllers').imageManagement;

app.post('/get-images', authorizationCheck, controllers.getImages);

app.post('/get-image-content', authorizationCheck, controllers.getImageContent);

app.post('/upload-image', authorizationGuard, controllers.uploadImage);

app.post('/delete-image', authorizationGuard, controllers.deleteImage);

app.post('/get-likes', controllers.likes);

app.post('/handle-like', authorizationGuard, controllers.handleLike);

app.post('/check-like', authorizationCheck, controllers.checkLike);

module.exports = app;