const jwt = require('jsonwebtoken');
const config = require('config');


function auth(req, res, next) {
    const token  = req.cookies.access_token;
    if (!token) return res.status(401).redirect('/u/login');
    jwt.verify(token, config.get('privats.secret_key'), (err, user) => {
        if (err) return res.status(401).redirect('/u/login');
        req.user = user;
        
        next();
    });
}  
module.exports = auth;