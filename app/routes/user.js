const { Router } = require("express");
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/",userController.information);
router.post("/update", userController.update);
module.exports = router;