const express = require("express");
const router = express.Router();

const path = require('path');

const JWTMiddleware = require("../middlewares/JWTMiddleware");

const signInRouter = require("./signInRouter");
const authorRouter = require("./authorRouter");
const bookRouter = require("./bookRouter");
const qiwiRouter = require('./qiwiRouter');

router.use("/signIn", signInRouter);
router.use("/author", JWTMiddleware, authorRouter);
router.get("/media/:filename", JWTMiddleware, (req, res, next) => {
    const dirName = path.dirname(require.main.filename);
    res.sendFile(`${dirName}/media/${req.params.filename}`);
});
router.use('/qiwi', qiwiRouter);
router.use("/", JWTMiddleware, bookRouter);

module.exports = router;