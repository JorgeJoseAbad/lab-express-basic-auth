/* jshint esversion:6 */
var express = require('express');
var private = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const bcrypt = require('bcrypt');

private.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

private.get('/', function(req, res, next) {
  res.render('private', {
    title: 'Private',
    user: req.session.currentUser
   });
});

module.exports=private;
