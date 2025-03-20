const jwt = require('jsonwebtoken');

const authorizationGuard = (req, res, next) => {

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send("Invalid or expired token.");
        }

        req.user = user;
        next();
    });
};

const authorizationCheck = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        req.authorized = false;
        next();
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            req.authorized = false;
        } else {
            req.authorized = true;
            req.user = user;
        }
        next();
    });
};

module.exports = { authorizationGuard, authorizationCheck };