const express = require('express');
const auth = require('../middlware/auth');
const { loginIndex, login, registerIndex, register, logout, resetPassword } = require('../controllers/UserController');
const router = express();

router.get('/login', loginIndex);
router.post('/login',login);
router.get('/register',registerIndex);
router.post('/register',register);
router.post('/logout', auth, logout);
router.post('/reset-password', auth, resetPassword);


module.exports = router;