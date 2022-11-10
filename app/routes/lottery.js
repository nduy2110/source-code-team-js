const express = require("express");
const lotteryController = require("../controllers/lottery");

const router = express.Router();

router.get("/", lotteryController.lotteryPage);
router.get("/xskt", lotteryController.award);
router.post("/", lotteryController.buyTicket);
router.get("/detail/:id", lotteryController.detail);

module.exports = router;