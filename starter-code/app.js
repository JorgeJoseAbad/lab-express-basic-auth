/* jshint esversion:6 */
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);
const express        = require("express");
const path           = require("path");
const logger         = require("morgan");
const cookieParser   = require("cookie-parser");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");



const index = require('./routes/index');
const main = require('./routes/main');
const private = require('./routes/private');
//var users = require('./routes/users');

const app            = express();



// Controllers


// Mongoose configuration

mongoose.connect("mongodb://localhost/basic-auth",{
  useNewUrlParser: true,
  useUnifiedTopology: true
 });
mongoose.Promise = global.Promise;

// Middlewares configuration


// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Access POST params with body parser
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: "basic-auth",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  resave: true,
  saveUninitialized: true
}));

// Authentication


// Routes
//app.use('/', index);
app.use('/', index); //se refiere a index.js
app.use('/main',main);
app.use('/private',private);
//app.use('/register',index)
//app.use('/users', users); //se refieren a users.js



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
