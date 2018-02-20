const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('chatapp', ['users']);
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Router used for '/register'

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

router.post('/', (req, res) => {
  console.log('Adding user...');
  // Get form Values
  const username  = req.body.username;
  const pw1       = req.body.password;
  const pw2       = req.body.password2;

  // Validation
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password fields are required').notEmpty();
  req.checkBody('password2', 'Password fields are required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(pw1);

  // Check for errors
  const errors = req.validationErrors();

  if (errors) {
    console.log('Form has errors');
    console.log(errors);
    res.render('register', {
      errors: errors,
      username: username,
      password: pw1,
      password2: pw2
    });
  } else {
    console.log('Success');
    const newUser = {
      username: username,
      password: pw1
    };

    // Encrypt password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;

        // Insert newUser into db.users
        db.users.insert(newUser, (error, doc) => {
          if (error) {
            res.send(error);
          }
          console.log('User added');

          // Success messages
          req.flash('success', 'Successfully registered');

          // Redirect after registration
          res.redirect('/');
        });
      });
    });
  }

});

module.exports = router;
