const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Database connection establishment
const {db, collections } = require('../database');
const collectionName = collections.images;

const filesControllers = {};

filesControllers.getImages = async (req, res) => {
    id = req.body.userID;
    if(req.custom)
    private = req.custom;
    else
    private = 'false';
    let result = await db.collection(collectionName).find({uid : id, private: private.toString()}).toArray();
    res.send(result);
}

filesControllers.exploreImages = async (req, res) => {
    category = req.body.category;
    var query = {private: 'false'};
    if(category) {
        query['categories.'+category] = {$exists: true};
    }
    let result = await db.collection(collectionName).find(query).limit(20).sort({_id: -1}).toArray();
    res.send(result);
}

filesControllers.uploadImage = async (req, res) => {
    image = req.files.image;
    try {
        var imgFile = {
            uid: req.body.userID,
            categories: JSON.parse(req.body.categories),
            private: req.body.Private,
        }
        const byteArrayBuffer = image.data;
        new Promise((resolve) => {
            cloudinary.v2.uploader.upload_stream((error, uploadResult) => {
                return resolve(uploadResult);
            }).end(byteArrayBuffer);
        }).then((uploadResult) => {
            payload = {
                ...imgFile,
                imageUrl: uploadResult.url,
                imageId: uploadResult.public_id
            }
            // console.log(payload);
            db.collection(collectionName).insertOne(payload).then(()=>{
                res.status(200).send();
            })
        });
    } catch (error) {
        console.error(error);
        res.status(300).send('Cannot read properties of undefined');
    }
}

filesControllers.deleteImage = async (req, res) => {
    imageID = req.body.imageID;
    cloudinary.v2.uploader.destroy(imageID)
        .then(() => {
            db.collection(collectionName).deleteOne({imageId: imageID})
            .then(() => res.status(200).send())
            .catch(error => res.status(400).send(error))
        })
        .catch(error => res.status(400).send(error));
}

module.exports = filesControllers;