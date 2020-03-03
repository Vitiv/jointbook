const express = require("express");
const router = express.Router();

const signInController = require('../controllers/signInController');

router.get('/', signInController.getPage);
router.post('/', signInController.signIn);
router.get('/logout', signInController.logout);

module.exports = router;