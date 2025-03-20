# PixelVault - Image Gallery Application Built with the MERN Stack

PixelVault is a user-friendly platform where creators, photographers, and designers can showcase their artwork, connect with a global community, and control the visibility of their images. It allows users to easily upload and manage their creations, engage with fellow artists, and discover new inspiration from around the world. Whether sharing public or private pieces, the platform provides a simple way to build and share your creative journey.

## How to Run the Application

The application is deployed on Vercel. [Click here](https://pixelvault.vercel.app) to access the live app.

To execute the code locally, follow the steps below:

### Backend
1. Navigate to the `NodeJS_backend` folder.

2. Create a `.env` file and define the following environment variables:

    ```
    PORT = 4444
    ORIGIN = https://localhost:3000

    SECRET_KEY = <random value>

    DATABASE_URL = <mongodb_uri>

    MAILER_HOST = <specify mail host for nodemailer>
    MAILER_UID = <mail id>
    MAILER_PASS = <password to authorize mail id at nodemailer>
    
    CLOUDINARY_CLOUD_NAME = <cloudinary cloud name>
    CLOUDINARY_API_KEY = <cloudinary api key>
    CLOUDINARY_API_SECRET = <cloudinary api secret key>
    ```

3. Install the dependencies by running the command:

    ```
    npm install
    ```

4. Once the dependencies are installed, start the backend server using:

    ```
    node .
    ```

### Frontend
1. Navigate to the `ReactJS_frontend` folder.

2. Create a `config.json` file in the `src` folder and define the following:

    ```json
    {
        "backend_server": "http://localhost:4444"
    }
    ```

3. Install the dependencies by running:

    ```
    npm install
    ```

4. Once the dependencies are installed, run the frontend application with:

    ```
    npm start
    ```

## Support

For any queries, issues, feedback, or inquiries, contact:  
[md.riyazuddin.dev@gmail.com](mailto:md.riyazuddin.dev@gmail.com)
