const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');

// Database connection establishment
const User = require('../database/user-model');
const { sendOtp, checkOtp, removeOtp } = require('./otp');
const { authorizationGuard } = require('../middlewares');
const contentHandler = require('./image_management');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const authentication = {};

// Controller to generate UUID
/**
 * @purpose {managing the user activity even without signing up}
 * @usage {currently not in use}
 */
authentication.generateUUID = async (req, res) => {
    try {
        const uuid = Math.random().toString(36).substr(2, 12).replace(/(.{4})(?=.)/g, '$1-');
        const payload = {
            uuid: uuid,
            fullname: null, 
            about: null,
            uid: null, 
            email: null, 
            password: null,
            picture: null,
            picture_id: null,
            created_at: new Date(),
            updated_at: new Date()
        };
    
        // await db.collection(collectionName).insertOne(payload);
        const token = jwt.sign(
            {uuid: uuid},
            process.env.SECRET_KEY,
            {}
        );
        res.status(200).json({ uuid: uuid, token: token });
    } catch(e) {
        res.status(500).send("Internal server error");

    }
}

authentication.login = async (req, res) => {
    const { uid, password } = req.body;
    if (!uid || !password) {
        return res.status(400).send("Missing important fields");
    }

    try {
        let result = await User.findOne({ uid: uid }).lean();
        if (result) {
            const matched = await bcrypt.compare(password, result.password);

            if (matched) {
                const payload = {
                    uid: result.uid,
                    fullname: result.fullname,
                    email: result.email,
                    picture: result.picture
                };

                const token = jwt.sign(payload, process.env.SECRET_KEY, {});

                return res.status(200).json({ user: payload, token: token });
            } else {
                return res.status(400).send('Password is incorrect');
            }
        } else {
            return res.status(400).send(`The id: ${uid} does not exist`);
        }
    } catch (e) {
        return res.status(500).send("Internal server error");
    }
};

authentication.register = async (req, res) => {
    const picture = req.files ? req.files.picture : null;
    const { fullname, uid, email, password, about } = req.body;

    if (!fullname || !about || !uid || !email || !password) {
        return res.status(400).send("Missing important fields");
    }

    try {
        let validation = await User.find({
            $or: [
                { uid: uid },
                { email: email.toLowerCase() }
            ]
        }).select('-_id');

        if(validation.length > 0) {
            return res.status(400).send("The UID or email is already taken");
        }

        const hash = await bcrypt.hash(password, 10);

        let uploadResult = {};
        if(picture)
        uploadResult = await new Promise((resolve) => {
            cloudinary.v2.uploader.upload_stream((error, uploadResult) => {
                return resolve(uploadResult);
            }).end(picture.data);
        });

        const payload = {
            fullname: fullname, 
            about: about,
            uid: uid, 
            email: email.toLowerCase(), 
            password: hash,
            picture: uploadResult.url ?? null,
            picture_id: uploadResult.public_id ?? null,
            created_at: new Date(),
            updated_at: new Date()
        };

        await User.create(payload);
    
        delete payload['about'];
        delete payload['password'];
        delete payload['picture_id'];
        delete payload['created_at'];
        delete payload['updated_at'];

        const token = jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {}
        );

        return res.status(200).json({user: payload, token: token});
    } catch (e) {
        return res.status(500).send("Internal server error");
    }
}

authentication.getUserDetails = async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(400).send("Missing important fields");
    }
    
    try {
        let result = await User.findOne({ uid: uid }).select('-_id -password -picture_id');
        if(result) {
            res.status(200).json(result);
        } else {
            res.status(404).send(`Username ${uid} does not exist`);
        }
    } catch(e) {
        res.status(500).send("Internal server error");

    }
}

authentication.updateUserDetails = [authorizationGuard, async (req, res) => {
    const picture = req.files ? req.files.picture : null;
    const { fullname, uid, email, about, password } = req.body;

    if (!fullname || !about || !uid || !email) {
        return res.status(400).send("Missing important fields");
    }

    if(password) return res.status(400).send("Do not include password in profile updation");

    try {
        if (req.user.uid != uid) {
            try {
                await contentHandler.updateOwnerId(req.user.uid, uid, req.body);
            } catch (error) {
                res.status(500).send("Error updating profile");
            }
        }

        let payload = {
            fullname: fullname, 
            about: about,
            uid: uid, 
            email: email.toLowerCase(),
            updated_at: new Date()
        };

        let uploadResult = {};

        if(req.user.picture != null) {
            const existing = await User.findOne({ uid: req.user.uid }).select('public_id');

            if(existing && existing.public_id) await cloudinary.v2.uploader.destroy(existing.public_id);
        }

        if(picture != null) {
            uploadResult = await new Promise((resolve) => {
                cloudinary.v2.uploader.upload_stream((error, result) => {
                    return resolve(result);
                }).end(picture.data);
            });
            payload = {
                ...payload, 
                picture: uploadResult.url ?? null,
                picture_id: uploadResult.public_id ?? null,
            }
        }

        const result = await User.findOneAndUpdate(
            { uid: req.user.uid },
            { $set: payload },
            {
                new: true,
                select: '-_id fullname uid email picture'
            }
        );

        const token = jwt.sign(
            JSON.stringify(result),
            process.env.SECRET_KEY,
            {}
        );

        res.status(200).json({user: result, token: token});
    } catch (e) {
        res.status(500).send("Internal server error");
    }
}]

authentication.checkUsername = async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(400).send("Missing important fields");
    }

    try {
        let result = await User.findOne({ uid: uid });
        if(result) {
            res.status(400).send("Username already exists");
        } else {
            res.status(200).send("Username available to use");
        }
    } catch(e) {
        res.status(500).send("Internal server error");
    }
}

authentication.updatePassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Missing important fields");
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        await removeOtp(email);
        const result = await User.findOneAndUpdate(
            { email: email.toLowerCase() }, 
            { $set: { password: hash, updated_at: new Date() } }, 
            {
                new: true,
                select: '-_id uid fullname picture email'
            }
        );

        if(result) {
            const token = jwt.sign(
                JSON.stringify(result),
                process.env.SECRET_KEY,
                {}
            )
            return res.status(200).json({user: result, token: token});
        } else return res.status(400).send("The email does not exist");
    } catch(e) {
        return res.status(500).send("Internal server error");
    }
}

authentication.verifyEmail = async (req, res) => {
    const { email } = req.body;
    if(!email) return res.status(400).send("Missing important fields");
    
    try {
        const result = await User.findOne({email: email.toLowerCase()});
        if(!result) return res.status(400).send("The email is not registered");
        else await sendOtp(email);
        res.status(200).send(`Email sent to ${email}`);
    } catch(e) {
        res.status(500).send("Internal server error");
    }
}

authentication.verityOtp = async (req, res) => {
    const { email, otp } = req.body;
    if(!email || !otp) return res.status(400).send("Missing important fields");

    try {
        await checkOtp(email, otp);
        res.status(200).send("Otp verified");
    } catch(e) {
        res.status(500).send("Internal server error");
    }
}

module.exports = authentication;