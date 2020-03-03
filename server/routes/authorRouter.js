const express = require("express");
const router = express.Router();

const authorController = require("../controllers/authorController");

router.get("/", authorController.getAuthors);
router.post("/", authorController.createAuthor);
router.post("/change", authorController.changeAuthor);
router.post("/delete", authorController.deleteAuthor);
router.get("/books", authorController.getAuthorsBooks);

module.exports = router;