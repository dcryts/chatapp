const express = require('express');
const router = express.Router();

router.get('/user_data', (req, res) => {
  if (req.isAuthenticated()) {
    // Get data from req
    const username = req.user.username;

    // Construct user object with all appropriate data
    const userObj = {
      username: username
    };

    res.json(userObj);
  }
});

module.exports = router;
