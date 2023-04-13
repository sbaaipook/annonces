require('dotenv').config();
require('./database/config');
const debug = require('debug')('annonces-app:info');
const express = require('express');
const app = express();
const users = require('./routes/users');
const dashboard = require('./routes/dashboard');
const home = require('./routes/home')
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const checkAuth = require('./middlware/checkAuth');
const Joi = require('joi');
const auth = require('./middlware/auth');
Joi.objectId = require('joi-objectid')(Joi);

//middleware
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true}));
app.use(express.static(`${__dirname}/public`))
app.set('view engine', 'ejs');

//routes
app.use('/u', users);
app.use('/dashboard',auth, dashboard);
app.use('/',checkAuth, home);






// handle all undefined routes
app.get('*', (req, res) => {
    res.render('fallback/404');
})
app.get('/401', (req, res) => {
    res.render('fallback/401');
})
app.get('/403', (req, res) => {
    res.render('fallback/403');
})










const port = process.env.APP_PORT || 5000
app.listen(port, () => {
    debug(`Server is running on [http://127.0.0.1:${port}]\nPress Ctrl+c to exit.`);
})