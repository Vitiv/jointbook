const jwt = require('jsonwebtoken');
const config = require('config');

const secret = config.get("JWT.secret");
const expiresInSeconds = config.get("JWT.expiresInSeconds");

module.exports.getInfoJWT = (JWT) => jwt.verify(JWT, secret, {expiresIn: expiresInSeconds}).data;
module.exports.createToken = (login, password) => jwt.sign({data: {login, password}}, secret, {expiresIn: expiresInSeconds});