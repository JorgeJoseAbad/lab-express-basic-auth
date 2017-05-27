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
  /*if (req.session.currentUser) {
    return res.send('You already logged')
  }*/

  res.render('auth-user', {
    header: 'New register of user',
    action: '/register',
    buttonText: 'Register',
    error: false
  });
});


router.post('/register', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const saltRounds = 10;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
      if (user !== null) {
        console.log('error en find one');
        res.send('Error en find one');
        //res.render("auth/signup", {
          //errorMessage: "The username already exists"
        //});
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
          console.log('error en NewUser.save');
          //res.render("auth/signup", {
          //  errorMessage: "Something went wrong when signing up"
          //});
        } else {
          res.redirect("/login");
        }
      });
    });
  /*anterior manera sin comprobar exixtencia de usuario
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) return next(err);
    const user = new User({username, hash});

    user.save(function(err, doc) {
      if (err) return next(err);
      res.redirect('/login');
    });
  });*/
});



router.get('/login', function(req, res, next) {
  res.render('auth-user', {
    header: 'Login a new secure user',
    action: '/login',
    buttonText: 'Login',
    error: false
  });
});

router.post('/login', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to log in"
    }); //esto no funcionará si no existe auth/login, claro
    return;
  }

    User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {

        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
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
      res.redirect("/login");
    }
  });
});

/* antigua manera, probablemente incorrecta

User.findOne({"username": username}, function(err, user) {
  if (err) return next(err);

  //const hash = user.password;
    bcrypt.compareSync(password, hash, function(err, isValid) {
      if (err) return next(err);

      if (!isValid) {
        res.render('auth-user', {
          header: 'Login a new secure user',
          action: '/login',
          buttonText: 'Login',
          error: true
        });
      }
      else {
        req.session.currentUser = user;
        res.redirect('/');
      }
    });*/




module.exports = router;
