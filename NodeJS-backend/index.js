const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

var uri = "mongodb://test:test@ac-trgrc9k-shard-00-00.k173qks.mongodb.net:27017,ac-trgrc9k-shard-00-01.k173qks.mongodb.net:27017,ac-trgrc9k-shard-00-02.k173qks.mongodb.net:27017/?ssl=true&replicaSet=atlas-11jyzg-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect().then(
  () => {console.log('Connected successfully to server');
}).catch(e => {
  console.log(e);
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'riyazuddin59208@gmail.com',
        pass: ''//password
    }
})

app.get('/', (req, res) => {
    res.send(`This is backend for https://tasvir.vercel.app`);
})

app.post('/login', async (req, res) => {
    username = req.body.uid;
    password = req.body.password;
    const db = client.db('Tasvir');
    const collection = db.collection('users');
    var result = await collection.findOne({ uid: username });
    if(result) {
        bcrypt.compare(password, result.password).then( (matched)=> {
            if(matched) {
                res.status(200).json(result).send();
            } else {
                res.status(300).send('password is incorrect');
            }
        })
    } else {
        res.status(300).send(`The id: ${username} does not exist`);
    }
})

app.post('/register', async (req, res) => {
    fullname = req.body.name;
    username = req.body.uid;
    mailID = req.body.mailID;
    password = req.body.password;
    const db = client.db('Tasvir');
    const collection = db.collection('users');
    bcrypt.hash(password, 10).then( async (hash) => {
        await collection.insertOne({name: fullname, uid: username, mailID: mailID, password: hash , splPass: ''});
        res.status(200).json({name: fullname, id: username}).send();
    })
})

app.post('/checkUsername', async (req, res) => {
    username = req.body.uid;
    const db = client.db('Tasvir');
    const collection = db.collection('users');
    var result = await collection.findOne({ uid: username });
    if(result) {
        res.status(300).send();
    } else {
        res.status(200).send();
    }
})

app.post('/createSpecialPassword', (req, res)=>{
    userID = req.body.userID;
    splPass = req.body.splPass;
    const db = client.db('Tasvir');
    const collection = db.collection('users');
    bcrypt.hash(splPass, 10).then( async (hash)=> {
        await collection.updateOne({ uid: userID }, {$set: {splPass: hash}});
        res.status(200).send();
    })
})
app.post('/specialPassword', async (req, res)=>{
    userID = req.body.userID;
    splPass = req.body.splPass;
    const db = client.db('Tasvir');
    const collection = db.collection('users');
    var result = await collection.findOne({uid: userID});
    bcrypt.compare(splPass, result.splPass).then((matched)=>{
        if(matched) {
            res.status(200).send();
        } else {
            res.status(300).send('password is incorrect');
        }
    })
})

app.post('/changepassword', (req, res) => {
    mailID = req.body.email;
    password = req.body.password;
    const db = client.db('Tasvir');
    const collection = db.collection('users');
    if(req.body.passType) {
        bcrypt.hash(password, 10).then( async (hash) => {
            await collection.updateOne({ mailID: mailID }, {$set: {splPass: hash}});
            res.status(200).send();
        })
    } else {
        bcrypt.hash(password, 10).then( async (hash) => {
            await collection.updateOne({ mailID: mailID }, {$set: {password: hash}});
            res.status(200).send();
        })
    }
})

app.post('/sendmail', async (req, res) => {
    mail = req.body.email;
    otp = req.body.otp;
    const db = client.db('Tasvir');
    const collection = db.collection('users');
    var result = await collection.findOne({ mailID: mail });
    if(!result) {
        res.status(300).send('The email is not registered');
    } else {
        var mailOptions = {
            from: 'riyazuddin59208@gmail.com',
            to: mail,
            subject: 'OTP for password change',
            html: `<p>Hello User!!!</p><p>Your One Time Password for password change is..</p><h4>${otp}</h4>`
        }
        transporter.sendMail(mailOptions, (error, info)=> {
            if (error) {
                res.status(300).send();
              } else {
                res.status(200).send();
              }
        })
    }
})

app.post('/getImages', async (req, res) => {
    id = req.body.userID;
    private = req.body.Private;
    const db = client.db('Tasvir');
    const collection = db.collection('images');
    let result = await collection.find({uid : id, private: private.toString()}).toArray();
    res.send(result);
})

app.post('/exploreImages', async (req, res) => {
    category = req.body.category;
    const db = client.db('Tasvir');
    const collection = db.collection('images');
    var query = {private: '0'};
    if(category) {
        query['categories.'+category] = {$exists: true};
    }
    let result = await collection.find(query).limit(20).sort({_id: -1}).toArray();
    res.send(result);
})

app.post('/upload', async (req, res) => {
    image = req.files.image;
    console.log(image);
    const db = client.db('Tasvir');
    const collection = db.collection('images');
    try {
        var imgFile = {
            uid: req.body.userID,
            categories: JSON.parse(req.body.categories),
            private: req.body.private,
            img: {
                data: image.data,
                contentType: image.mimetype
            }
        }
        collection.insertOne(imgFile).then(()=>{
            res.status(200).send();
        })
    } catch {
        res.status(300).send('Cannot read properties of undefined');
    }
})
app.post('/deleteImage', async (req, res) => {
    imageID = req.body.imageID;
    const db = client.db('Tasvir');
    const collection = db.collection('images');
    const result = await collection.deleteOne({_id: new ObjectId(imageID)});
    res.status(200).send();
})

app.listen(4444,() => {
    console.log('listening at port 4444');
})