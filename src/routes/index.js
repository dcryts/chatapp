

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

  // TODO somewhere... manage how many messages db stores
  router.post('/', (req, res) => {
    console.log(`Server POST req received from ${req.user.username}`);
    // console.log(io);
    // io.sockets.emit('msg', { body: req.body });


    // console.log(`req.body:`);
    // console.log(req.body);
    // res.end();

    //TODO post to db
    if (!req.isAuthenticated()) {
      res.redirect('/login');
    }

    // if (req.isAuthenticated()) {
    //   console.log('Message posting...');
    //   const msg = req.body['chat-message'];
    //   const user = req.user.username;
    //
    //   const msgObj = {
    //     user: req.user.username,
    //     date: null,
    //     msg: msg
    //   };
    //   if (msg !== null && msg !== '') {
    //     db.chatlog.insert(msgObj, (error, doc) => {
    //       if (error) {
    //         res.send(error);
    //       }
    //       console.log(`${msgObj.user} sent '${msgObj.msg}' at ${msgObj.date}`);
    //       res.end(200);
    //     });
    //   }
    // }
    // res.redirect('/login');
    res.end();
  });

  return router;
};

module.exports = returnRouter;
