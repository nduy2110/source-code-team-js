const { Router } = require("express");
const express = require("express");
const router = express.Router();

router.get('/',(req,res) => {
  session=req.session;
  if(session.userid){
    res.render("index",{
      login:true
    });
  }else
  res.render("login");
});

router.get("/register", (req, res) => {
  session=req.session;
  if(session.userid){
    res.render("index",{
      message:"Please log out"
    });
  }else
  res.render("register");
});

router.get("/login", (req, res) => {
  session=req.session;
  if(session.userid){
    res.render("index",{
      message:"You are logged in"
    });
  }else
  res.render("login");
});

router.get("/forgotPassword", (req, res) => {
  session=req.session;
  if(session.userid){
    res.render("index",{
      message:"Please log out"
    });
  }else
  res.render("forgotPassword");
});

router.get("/subscribe", (req,res) =>{
  if(session.userid){
    res.render("subscribe",{
      login:true
    });
  }else
  res.render("subscribe");
});
router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;