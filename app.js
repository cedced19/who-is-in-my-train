var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var minifyTemplate = require('express-beautify').minify;

var passport = require('passport');
var flash = require('connect-flash');
var helmet = require('helmet');
var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compress());

if (app.get('env') === 'development') {
    app.use(logger('dev'));
} else {
    app.use(compress());
    app.use(minifyTemplate());
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());



app.use(flash());
app.use(session({
    secret: 'website of the Who is in my train',
    name: 'who-is-in-my-train-session',
    proxy: false,
    resave: true,
    saveUninitialized: true,
    store: new MongoDBStore({
        uri: 'mongodb://localhost:27017/who-is-in-my-train',
        collection: 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index'));

// authentication
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.ROOT_URL + '/auth/facebook/callback'
},
    function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Élément introuvable');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            status: err.status || 500,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        status: err.status || 500,
        error: {}
    });
});

module.exports = app;