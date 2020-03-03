const JWTHelper = require("../utils/JWTHelper");

const getPage = async (req, res, next) => {
    res.render("signInPage", {});
};

const signIn = async (req, res, next) => {
    res.cookie('JWT', JWTHelper.createToken(req.body.login, req.body.password));
    res.redirect("/");
};

const logout = async (req, res, next) => {
    res.cookie('JWT', '');
    res.redirect("/signIn");
};

module.exports = {
    getPage, signIn, logout
};