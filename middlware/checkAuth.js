const jwt = require('jsonwebtoken');
const config = require('config');


function checkAuth(req, res, next) {
    const token  = req.cookies.access_token;
    if (!token) return next();
    jwt.verify(token, config.get('privats.secret_key'), (err, user) => {
        if (err) return next();
        req.user = user;
        
        next();
    });
}  
module.exports = checkAuth;