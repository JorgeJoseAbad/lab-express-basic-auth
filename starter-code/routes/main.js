/* jshint esversion:6 */
var express = require('express');
var main = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const bcrypt = require('bcrypt');

main.use((req, res, next) => {
  if (req.session.currentUser) {
    next(); //pasa al siguiente, a main.get
  } else { res.redirect("/login"); }
});

main.get('/', function(req, res, next) {
  res.render('main', { title: 'Main' });
});

module.exports=main;
