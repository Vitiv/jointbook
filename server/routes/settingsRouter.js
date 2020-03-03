const express = require("express");
const router = express.Router();

const settingsController = require("../controllers/settingsController");

router.get("/", settingsController.readAll);
router.post("/", settingsController.writeAll);

module.exports = router;