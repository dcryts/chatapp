let returnRouter = function (io) {
  const express = require('express');
  const router = express.Router();
  const mongojs = require('mongojs');
  const db = mongojs('chatapp', ['chatlog']);


  router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.render('index', { username: req.user.username });
    } else {
      res.redirect('/login');
    }
  });

  // Posting a message
  router.post('/', (req, res) => {
    console.log(`Server POST req received`); //from ${req.user.username}`);

    if (!req.isAuthenticated()) {
      res.redirect('/login');
    }

    console.log('Message posting...');
    const msgObj = req.body;

    // Store in db
    db.chatlog.insert(msgObj, (error, doc) => {
      if (error) {
        res.send(error);
      }
      console.log(`${msgObj.username} sent '${msgObj.msg}' at ${msgObj.date}`);
      res.send(200);
    });
  });

  return router;
};

module.exports = returnRouter;
