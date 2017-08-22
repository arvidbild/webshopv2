var passport = require('passport');
var User = require('../src/models/User');
var FacebookStrategy = require("passport-facebook").Strategy;

//Uncomment this in local enviroment to get the clientID & clientSecret
//var passwords = require("./passwords/passwords.js");
//console.log(passwords);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

var port = process.env.PORT

//use facebook login with passport strategy (process.env. is enviroment variables)
//use passwords.clientID in localenviroment and localhost:5000
passport.use(new FacebookStrategy({
    clientID: process.env.clientID, 
    clientSecret: process.env.clientSecret,
    callbackURL: "http://"+process.port+"/users/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'link', 'photos', 'emails']
  },
    function (accessToken, refreshToken, profile, done){
      console.log(profile);

      if(profile.emails[0]) {
        User.findOneAndUpdate(
          { emailAdress: profile.emails[0].value },
          {
               fullName: profile.displayName || profile.username,
            emailAdress: profile.emails[0].value,
              imagePath: profile.photos[0].value
          },
          {
            upsert: true
          },
        done
      );
      } else {
        var noEmailError = new Error("Your email privacy settings prevent you from signing into Bookworm.");
        done(noEmailError, null);
      }
    }
));