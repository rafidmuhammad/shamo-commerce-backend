const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send('Hello from APIv1 root route.');
  });

module.exports = router;