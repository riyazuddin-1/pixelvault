# Tasvir - Image Gallery application built with MERN stack
A fullstack application built with MERN stack to upload, explore and download images based on the category provided.
Developed user authentication from scratch.
Features include category based image filter, password-protected folder to authorized users.

## How to run the application
The application is deployed on vercel. [click here](https://tasvir.vercel.app)

To execute the code in the repo, follow the steps given below

### Backend 
1. Move to `NodeJS_backend` folder\

2. create a `.env` file and define the following elements\
>PORT = 4444\
>ORIGIN = https://localhost:3000\
>DATABASE_URL = mongodb_uri\
>MAILER_HOST = specify mail host for nodemailer\
>MAILER_UID = mail id\
>MAILER_PASS = password to authorize mail id at nodemailer\
>
>CLOUDINARY_CLOUD_NAME = cloudinary cloud name\
>CLOUDINARY_API_KEY = cloudinary api key\
>CLOUDINARY_API_SECRET = cloudinary api secret key

3. Download the dependencies with `npm i` command

4. Once the dependencies are downloaded, run the backend application with `node .` command

### Frontend
1. Move to `ReactJS_backend` folder\

2. create a `config.json` file in the `src` folder and define the following elements
```
{
    "backend_server": "http://localhost:4444" 
}
```

3. Download the dependencies with `npm i` command

4. Once the dependencies are downloaded, run the backend application with `npm start` command

## Support
For any kind of queries, issues, feedbacks or inquiries, contact to md.riyazuddin.dev@gmail.com