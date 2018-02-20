const express = require('express');
const router = express.Router();

router.get('/user_data', (req, res) => {
  if (req.isAuthenticated()) {
    // get data from req
    const username = req.user.username;

    // construct user object with all appropriate data
    const userObj = {
      username: username
    };

    res.json(userObj);
  }
});

module.exports = router;
