var passport = require('passport');
var User = require('../src/models/User');
var FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google-oauth2").Strategy;


//Uncomment this in local enviroment to get the clientID & clientSecret
var passwords = require("./passwords/passwords.js");
console.log(passwords);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//var port = process.env
//console.log(port);

//use facebook login with passport strategy (process.env. is enviroment variables)
//use passwords.clientID in localenviroment and localhost:5000
passport.use(new FacebookStrategy({
    clientID: passwords.facebookclientID, 
    clientSecret: passwords.facebookclientSecret,
    callbackURL: "https://localhost:5000/users/auth/facebook/callback",
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
            upsert: true //creates a new document if no document match
          },
        done
      );
      } else {
        var noEmailError = new Error("Your email privacy settings prevent you from signing into Bookworm.");
        done(noEmailError, null);
      }
    }
));


passport.use(new GoogleStrategy({

        clientID     : passwords.googleclientID,
        clientSecret : passwords.googleclientSecret,
        callbackURL  : "https://localhost:5000/users/auth/google/callback"

    },
    function(token, refreshToken, profile, done) {

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
            upsert: true //creates a new document if no document match
          },
        done
      );
      } else {
        var noEmailError = new Error("Your email privacy settings prevent you from signing into Bookworm.");
        done(noEmailError, null);
      }
           
     
})); 