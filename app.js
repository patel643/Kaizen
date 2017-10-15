const debug = require('debug')('app:startup');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');

const index = require('./routes/index');
const expressMongoDb = require('express-mongo-db');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


//Exposing all custom js for Application
const auth = require('./auth');

//Initialize express
const app = express();


var exphbs = require('express-handlebars');

// Create an instance of the express-handlebars
// If you want to pass any option offered by express-handlebar module
// do it inside the create() in the handlebars.js file
var handlebars  = require('./helpers/handlebars.js')(exphbs);

// The handlebars variable now has an object called engine.
// Use that to define your app.engine
// As said before, you don't need to define any options here.
// Everything is defined in the create() in handlebars.js
app.engine('hbs', handlebars.engine);

// If you are using a different extension, you can change hbs to whatever you are using.
app.set('view engine', 'hbs');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//The mongo DB URI specified at .env
app.use(expressMongoDb(process.env.DB_URI));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ url: process.env.DB_URI }),
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  // always make req.user available to the template
  res.locals.user = req.user;
  next();
});

//Attach custom js with the routes.
app.use('/', index);
app.use('/', auth.router);

/**
* Note:
  This is how you may want to call a user specific page
    app.get('/protected', ensureLoggedIn('/login'), function(req, res, next) {
     res.render('protected');
    });
*/

// error handler
app.use(function(err, req, res, next) {
  console.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

debug(`app.js loaded`);

module.exports = app;
