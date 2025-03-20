const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const Image = require('../database/image-model');
const Like = require('../database/like-model');
const { collections } = require('../database');

const contentHandler = {};

contentHandler.updateOwnerId = async (uid, newUid ) => {
    if(!uid || !newUid) return res.status(400).send("Missing important fields");

    try {
      await Image.updateMany({ uid: uid }, { $set: { uid: newUid } });
      return;
    } catch (error) {
        throw error;
    }
}

contentHandler.getImages = async (req, res) => {
    const { uid, access, categories, matchAll, limit = 12, search, sort } = req.body;

    let query = {};

    if (uid) query.uid = uid;

    if (access === "editor") {
        if (!req.authorized) return res.status(400).send("Authorization failed");
        else query.uid = req.user.uid;
    } else query.published = true;

    if (categories) {
        query.categories = matchAll == "true" ? { $all: categories } : { $in: categories };
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    try {
        let result = [];

        if (!sort || sort === "") {
            result = await Image.find(query)
                .select('_id url uid title created_at')
                .limit(Number(limit))
                .sort({ created_at: -1 });
        } else if (sort === "popular") {
            result = await Image.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: "likes",
                        localField: "_id",
                        foreignField: "content_id",
                        as: "likesData"
                    }
                },
                {
                    $addFields: {
                        likesCount: { $size: "$likesData" }
                    }
                },
                { $sort: { likesCount: -1 } },
                { $limit: Number(limit) },
                { $project: { _id: 1, url: 1, uid: 1, title: 1, created_at: 1 } }
            ]);
        } else if (sort === "favourites") {
            if (!req.authorized) return res.status(200).json([]);
            
            result = await Like.aggregate([
                { $match: { liked_by: req.user.uid } },
                {
                    $lookup: {
                        from: collections.images,
                        localField: "content_id",
                        foreignField: "_id",
                        as: "imageData"
                    }
                },
                { $unwind: "$imageData" },
                { $replaceRoot: { newRoot: "$imageData" } },
                { $sort: { created_at: -1 } },
                { $limit: Number(limit) },
                { $project: { _id: 1, url: 1, uid: 1, title: 1, created_at: 1 } }
            ]);
        } else if (sort === "random") {
            result = await Image.aggregate([
                { $match: query },
                { $sample: { size: Number(limit) } },
                { $project: { _id: 1, url: 1, uid: 1, title: 1, created_at: 1 } }
            ]);
        } else {
            return res.status(200).json([]);
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).send("Internal server error");
    }
};

contentHandler.getImageContent = async (req, res) => {
    const { uid, id } = req.body;

    if(!uid || !id) return res.status(400).send("Missing important fields");

    try {
        const result = await Image.findById(id).select('-id');
        if(!result) return res.status(400).send("No such content exists");
        else if(!result.published) {
            if(!(req.authorized && req.user.uid == result.uid))
            return res.status(400).send("Not authorized to view this content");
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).send("Internal server error");

    }
};

contentHandler.uploadImage = async (req, res) => {
    const image = req.files ? req.files.image : null;
    const { title, description, categories, published } = req.body;

    if (!image || !title || !description || !categories || !published) {
        return res.status(400).send("Missing important fields");
    }

    try {
        let payload = {
            uid: req.user.uid,
            categories: categories.split(","),
            published: published === 'true',
            folder_id: "",
            title: title,
            description: description,
            name: image.name,
            created_at: new Date(),
            updated_at: new Date()
        }

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(image.data);
        });

        if(!uploadResult) return res.status(400).send("Error uploading image");
    
        payload = {
            ...payload,
            url: uploadResult.url,
            id: uploadResult.public_id
        }
        await Image.create(payload);
        return res.status(200).send("Uploaded successfully");
    } catch (error) {
        return res.status(500).send("Internal server error");

    }
};

contentHandler.deleteImage = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send("Missing important fields");
    }

    try {
        let result = await Image.findOne({ _id: id, uid: req.user.uid });
      if(!result) return res.status(404).send("Content not found");
      await cloudinary.v2.uploader.destroy(result.id);
      await Image.deleteOne({ _id: id, uid: req.user.uid });
      return res.status(200).send("Deleted");
    } catch (error) {
      return res.status(400).send("Unexpected error occurred");
    }
};

contentHandler.likes = async (req, res) => {
    const { id } = req.body;
    if(!id) return res.status(400).send("Missing important fields");

    try {
        const count = await Like.countDocuments({
            content_id: id
        });
        return res.status(200).send(String(count));
    } catch(e) {
        return res.status(500).send("Internal server error");

    }
};

contentHandler.handleLike = async (req, res) => {
    const {id} = req.body;
    if (!id) return res.status(400).send("Missing important fields");

    try {
        const exists = await Like.findOne({
            content_id: id,
            liked_by: req.user.uid
        });

        if (exists) {
            await Like.deleteOne({
                content_id: id,
                liked_by: req.user.uid
            });
            return res.status(200).send("Like removed");
        } else {
            await Like.create({
                content_id: id,
                liked_by: req.user.uid,
                created_at: new Date()
            });
            return res.status(200).send("Like added");
        }
    } catch (e) {
        return res.status(500).send("Internal server error");
    }
};

contentHandler.checkLike = async (req, res) => {
    if(!req.authorized) return res.status(204).send();

    const {id} = req.body;
    if(!id) return res.status(400).send("Missing important fields");

    try {
        let result = await Like.findOne({
            content_id: id,
            liked_by: req.user.uid
        });
        if(result)
        return res.status(200).send();
        else
        return res.status(204).send();
    } catch(e) {
        return res.status(500).send("Internal server error");

    }
};

module.exports = contentHandler;