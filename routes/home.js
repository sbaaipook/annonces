const express = require('express');
const { index } = require('../controllers/HomeController');
const router = express();

router.get('/', index);


module.exports = router;