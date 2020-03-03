const express = require("express");
const router = express.Router();

const multer = require('multer');
const uuidv4 = require('uuid/v4');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'media/');
    },
    filename: (req, file, cb) => {
        let split = file.originalname.split(".");
        let name = split[0];
        let expansion = split[1];
        cb(null, `${name}${uuidv4()}.${expansion}`);
    }
});

const bookController = require("../controllers/bookController");

const upload = multer({storage});

router.get("/", bookController.getBooksPage);
router.get("/create", bookController.getCreateBookPage);
router.post("/", multer({storage}).fields([{name: "image"}, {name: "file"}]), bookController.createBook);
router.post("/change", multer({storage}).fields([{name: "image"}, {name: "file"}]), bookController.changeBook);
router.get("/change", bookController.getChangeBookPage);
router.post("/delete", bookController.deleteBook);

module.exports = router;