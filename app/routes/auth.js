const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();
router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/forgotPassword",authController.forgotPassword);
router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;