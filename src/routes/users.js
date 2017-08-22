var express = require('express');
var router = express.Router();
var passport = require("passport");


router.get("/signup", function(req,res,next){
	res.render("signup");
}); 

//The scope has to be there since it asking the user for additional permission to use the email
router.get('/auth/facebook',
  passport.authenticate('facebook',{scope: ["email"]}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
  	console.log("the authentication was Successful");
    
    // Successful authentication, redirect to profile.
    res.redirect('/users/profile');
  });

router.get("/auth/google", 
	passport.authenticate("google",{scope: ["email"]}));

router.get("/auth/google/callback",
  passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
  	console.log("the authentication was Successful");
    
    // Successful authentication, redirect to profile.
    res.redirect('/users/profile');
  });

router.get("/profile", function(req,res,next){
	res.render("profile");
});

module.exports = router;