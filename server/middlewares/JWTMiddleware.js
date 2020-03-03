const express = require("express");
const config = require("config");
const router = express.Router();

const credentials = config.get("credentials");

const JWTHelper = require("../utils/JWTHelper");

router.use((req, res, next) => {
    try {
        let data = JWTHelper.getInfoJWT(req.cookies.JWT);
        if (data.login === credentials.login && data.password === credentials.password) {
            next()
        } else {
            res.redirect('/signIn');
        }
    } catch (e) {
        res.redirect('/signIn');
    }
});

module.exports = router;