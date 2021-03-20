/* jshint esversion:6 */
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const bcrypt = require('bcrypt');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/register', function(req, res, next) {

  res.render('auth-user', {
    header: 'New register of user',
    action: '/register',
    buttonText: 'Register',
    error: false,
    errorMessage: ""
  });
});


router.post('/register', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const saltRounds = 10;

  if (username === "" || password === "") {
    res.render("auth-user", {
      header: 'New register of user',
      action: '/register',
      buttonText: 'Register',
      error: true,
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
      if (user !== null) {
        console.log('error en find one');
        res.render("auth-user", {
          header: 'New register of user',
          action: '/register',
          buttonText: 'Register',
          error: true,
          errorMessage: "The username already exists"
        });
        return;
      }

    var salt     = bcrypt.genSaltSync(saltRounds);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });
    newUser.save((err) => {
        if (err) {
          res.render("auth-user", {
          header: 'New register of user',
          action: '/register',
          buttonText: 'Register',
          error: true,
          errorMessage: "Something went wrong when signing up"
          });
        } else {
          res.redirect("/login");
        }
      });
    });

});

router.get('/login', function(req, res, next) {
  res.render('auth-user', {
    header: 'Login a new secure user',
    action: '/login',
    buttonText: 'Login',
    error: false,
    errorMessage: ""
  });
});

router.post('/login', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth-user", {
      header: 'Login a new secure user',
      action: '/login',
      buttonText: 'Login',
      error: true,
      errorMessage: "Indicate a username and a password to log in"
    }); //esto no funcionará si no existe auth/login, claro
    return;
  }

    User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth-user", {
          header: 'Login a new secure user',
          action: '/login',
          buttonText: 'Login',
          error: true,
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {

        // Save the user logged in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth-user", {
          header: 'Login a new secure user',
          action: '/login',
          buttonText: 'Login',
          error: true,
          errorMessage: "Incorrect password"
        });
      }
    });

});

router.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("logout hecho??");
      res.redirect("/");
    }
  });
});


module.exports = router;
