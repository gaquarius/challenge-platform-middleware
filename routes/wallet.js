const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/', function(req, res, next) {
  if (req.user.name && req.user.name === process.env.JWT_USERNAME) {

  } else {
    res.status(401).json({
      message: 'Unauthorized',
      error: 401
    });
  }
});

module.exports = router;
