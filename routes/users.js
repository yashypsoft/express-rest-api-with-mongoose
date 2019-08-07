var express = require("express");
const bodyParser = require("body-parser");
var User = require("../models/user");
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res, next) => {
  User.register(new User({ username: req.body.username }),
  req.body.password,(err,user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({err:err});      } 
      else {
       passport.authenticate('local')(req,res,()=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ sucess: true, status: "Registration Suceesful" });
       });
      }
    });   
});

router.post("/login",passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ sucess:true,status: "Login Suceesful" });
});

 router.get('/logout',(req,res,next)=>{
   if(req.session){
     req.session.destroy();
     res.clearCookie('session-id');
     res.redirect('/');
   }
   else{
     var err = new Error('You are not logged in');
     err.status = 403;
     next(err);
   }
 })

module.exports = router;
