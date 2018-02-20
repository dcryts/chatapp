const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('chatapp', ['users']); // :
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// router used for '/login'

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

router.get('/logout', (req, res) => {
  // req.logout();
  // req.flash('success', 'Bye!');
  // res.redirect('/login');
  req.logout();
  req.session.destroy((err) => {
    res.redirect('/login');
  });

});

// Serialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});
// Deserialize
passport.deserializeUser((id, done) => {
  db.users.findOne({_id: mongojs.ObjectId(id)}, (err, user) => {
    done(err, user);
  });
});

// use local strat
passport.use(new LocalStrategy(
  function (username, password, done) {
    db.users.findOne({username: username},
      function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: 'Incorrect username'});
        }

        bcrypt.compare(password, user.password,
        function (err, isMatch) {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {message: 'Incorrect password'});
          }
        });
      }
    );
  }
));

// upon a POST request to '/login', authenticate
router.post('/', passport.authenticate('local', {
                                                        successRedirect: '/',
                                                        failureRedirect: '/login',
                                                        failureFlash: 'Invalid credentials'
                                                      }),
    function (req, res) {
      console.log('Authentication successful');
      res.redirect('/');
    }
);

module.exports = router;
