const express = require("express");
const subscribeController = require("../controllers/subscribe");

const router = express.Router();

router.post("/register", subscribeController.register);


module.exports = router;