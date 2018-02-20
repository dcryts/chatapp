let returnRouter = function (io) {
  const express = require('express');
  const router = express.Router();
  const mongojs = require('mongojs');
  const db = mongojs('chatapp', ['users']);
  const bcrypt = require('bcryptjs');
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;

  // Router used for '/login'

  router.get('/', (req, res) => {
    if (req.isAuthenticated() ){
      res.redirect('/');
    } else {
      res.render('login');
    }
  });

  router.get('/logout', (req, res) => {
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

  // Use local strat
  passport.use(new LocalStrategy(
    function (username, password, done) {
      if (io.connectedUsers.hasOwnProperty(username)) {
        return done(null, false, { message: 'Already logged in' });
      }

      db.users.findOne({username: username},
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: 'Incorrect username' });
          }

          bcrypt.compare(password, user.password,
          function (err, isMatch) {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect password' });
            }
          });
        }
      );
    }
  ));

  // Upon a POST request to '/login' -> authenticate
  router.post('/', passport.authenticate('local', {
                                                          successRedirect: '/',
                                                          failureRedirect: '/login',
                                                          failureFlash: true
                                                        }),
      function (req, res) {
        console.log('Authentication successful');
        res.redirect('/');
      }
  );

  return router;
}

module.exports = returnRouter;
