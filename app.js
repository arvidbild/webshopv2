var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require("morgan");
var pug = require("pug");
var passport = require("passport");

//mongoose
var mongoose = require("mongoose");

//sessions
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

//, data.json and seeder
var seeder = require("mongoose-seeder");
var data = require("./src/data/data.json");

//reuire our routes
var index = require('./src/routes/index');
var users = require('./src/routes/users');
var api = require("./src/routes/api");
var cart = require("./src/routes/cart");
require('./config/passport');

var app = express();

/** 
Connect to the database
mongodb://localhost:27017/webshopv2
**/
mongoose.connect("mongodb://heroku_g39126c8:td8tr890n43do6runsrcaqiol8@ds151153.mlab.com:51153/heroku_g39126c8");
var db = mongoose.connection;

db.on("error", console.error.bind(console,"connetion error"));

db.once("open", function() {
    seeder.seed(data).then(function(){
    console.log("the data has been seeded");
    }).catch(function(err) {
    // handle error
        console.log(err);
    }); 
});

//Set the port 
app.set("port", process.env.PORT || 5000);

app.listen(process.env.PORT || 5000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// view engine setup
app.set('view engine', 'pug');
app.set('views', "./public/views");


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// morgan gives us http request logging
app.use(morgan('dev'));

// Use the session middleware
app.use(session({ 
             secret: 'keyboard cat', 
            resave: false, //don't save session if unmodified 
 saveUninitialized: false, // don't create session until something stored 
              store: new MongoStore({mongooseConnection: mongoose.connection}),
             cookie: {maxAge: 180 * 60 * 1000} 
}));

//middleware for the session to be reached too all views
app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
})

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// setup our static route to serve files from the "public" folder
app.use("/", express.static('public'));

//Setup for our routes
app.use('/', index);
app.use('/users', users);
app.use("/api", api);
app.use("/cart", cart);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
