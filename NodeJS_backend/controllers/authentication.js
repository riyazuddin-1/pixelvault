const { getImages } = require('./image_management');
const bcrypt = require('bcryptjs');

// Database connection establishment
const {db, collections } = require('../database');
const collectionName = collections.users;

const authControllers = {};

authControllers.login = async (req, res) => {
    userID = req.body.uid;
    password = req.body.password;
    var result = await db.collection(collectionName).findOne({ uid: userID });
    if(result) {
        bcrypt.compare(password, result.password).then( (matched)=> {
            if(matched) {
                res.status(200).json(result).send();
            } else {
                res.status(300).send('password is incorrect');
            }
        })
    } else {
        res.status(300).send(`The id: ${userID} does not exist`);
    }
}

authControllers.register = async (req, res) => {
    fullname = req.body.fullname;
    userID = req.body.uid;
    mailID = req.body.email;
    password = req.body.password;
    bcrypt.hash(password, 10).then( async (hash) => {
        const query = {username: fullname, uid: userID, mailID: mailID.toLowerCase(), password: hash , splPass: ''};
        await db.collection(collectionName).insertOne(query);
        res.status(200).json(query).send();
    })
}

authControllers.getUserDetails = async (req, res) => {
    userID = req.body.userID;
    var result = await db.collection(collectionName).findOne({ uid: userID }, { uid: 1, username: 1 });
    if(result)
        res.status(200).json(result).send();
    else
        res.status(300).send(`UserID ${userID} does not exist`);
}

authControllers.checkUsername = async (req, res) => {
    username = req.body.uid;
    var result = await db.collection(collectionName).findOne({ uid: username });
    if(result) {
        res.status(300).send();
    } else {
        res.status(200).send();
    }
}

authControllers.changePassword = (req, res) => {
    mailID = req.body.email;
    password = req.body.password;
    if(req.body.passType) {
        bcrypt.hash(password, 10).then( async (hash) => {
            await db.collection(collectionName).updateOne({ mailID: mailID }, {$set: {splPass: hash}});
            res.status(200).send();
        })
    } else {
        bcrypt.hash(password, 10).then( async (hash) => {
            await db.collection(collectionName).updateOne({ mailID: mailID }, {$set: {password: hash}});
            res.status(200).send();
        })
    }
}

authControllers.createSpecialPassword = (req, res)=>{
    userID = req.body.userID;
    splPass = req.body.splPass;
    bcrypt.hash(splPass, 10).then( async (hash)=> {
        await db.collection(collectionName).updateOne({ uid: userID }, {$set: {splPass: hash}});
        res.status(200).send();
    })
}

authControllers.checkSpecialPassword = async (req, res)=>{
    userID = req.body.userID;
    splPass = req.body.splPass;
    var result = await db.collection(collectionName).findOne({uid: userID});
    bcrypt.compare(splPass, result.splPass).then((matched)=>{
        if(matched) {
            req.custom = "true";
            getImages(req, res);
        } else {
            res.status(300).send('password is incorrect');
        }
    })
}

module.exports = authControllers;