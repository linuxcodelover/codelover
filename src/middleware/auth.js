const jwt = require("jsonwebtoken");
const Register = require("../db/model/schemamodel");

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        // const verifyUser = jwt.verify(token, "iritiritiritiritiritiritiritiritir");
        console.log(verifyUser);

        const user = await Register.findOne({ _id: verifyUser._id });
        console.log(user);

        // to log out
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send(error);
        console.log(error);
    }
};

module.exports = auth;