const Joi = require('joi');
const { User, validUser } = require('../models/User');
const  bcrypt = require('bcrypt');
const debug = require('debug')('annonce-app:user')



exports.registerIndex = (req, res) => {
    return res.render('auth/register', {
        error: null,
        email: null,
        username: null,
        password: null,
        address: null
    })
}

exports.profile = async (req, res) => {
    const user = await User.findById(req.user._id).select('username email address');
    return res.render('dashboard/profile/index',{ user, error:null, success:null })
}

exports.register = async (req, res) => {
    const { error } = validUser(req.body);
    if (error) return res.status(400).render('auth/register', userinfo(req, error.message));

    const username = await User.findOne({username:req.body.username});
    if (username) return res.status(400).render('auth/register', userinfo(req, 'username already taken!'));
    const useremail = await User.findOne({email: req.body.email});
    if (useremail) return res.status(400).render('auth/register', userinfo(req, 'email already exist!'));

    if (req.body.password !== req.body.confirm_password) return res.status(400).render('auth/register', userinfo(req, 'please type the right password in the confirmation feild'));
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        username: req.body.username,
        address: req.body.address,
        password: hashedPassword
    });

    try {
        await user.save();
    }
    catch (ex) {
        return res.status(500).render('auth/register', userinfo(req, 'An error occured in the server!'));
    }
    const token = user.genAuthToken();
    res.cookie('access_token', token).redirect('/dashboard');

}


exports.loginIndex = (req, res) => {
    return res.render('auth/login', {
        error: null,
        username: null,
        password: null
    })
}


exports.login = async (req, res) => {
    const { error } = validUser(req.body,'login');
    if (error) return res.status(400).render('auth/login', userinfo(req, error.message, 'login'));

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).render('auth/login', userinfo(req, 'invalid username or password', 'login'));

    const validPassword = await bcrypt.compare(req.body.password , user.password);

    if (!validPassword) return res.status(400).render('auth/login', userinfo(req, 'invalid username or password', 'login'));

    const token = user.genAuthToken();
    res.cookie('access_token', token).redirect('/dashboard')

}

exports.resetPassword = async (req, res) => {
    let user = await User.findOne({ _id: req.user._id });
    const { error } = validateResetPassword(req.body);
    if ( error ) return res.status(400).render('dashboard/profile/index',{ user, error: error.message, success:null });
    const validPassword = await bcrypt.compare(req.body.current_password, user.password); 
    if (!validPassword) return res.status(400).render('dashboard/profile/index',{ user, error: 'The current password is incorrect!', success: null});
    if (req.body.new_password !== req.body.confirm_new_password) return res.status(400).render('dashboard/profile/index',{ user, error: 'The "confirmation" should be the same as "new password"', success:null});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.new_password, salt);

    user.password = hashedPassword;

    try {
        await user.save()
        return res.status(200).render('dashboard/profile/index',{ user, error: null , success: 'Password has updated !'});
    } catch (ex) {
        debug(ex.message);
        return res.status(500).render('dashboard/profile/index',{ user, error: 'An error occured on the server ', success: null});
    }

    
    
}
exports.logout = (req, res) => {
    return res.clearCookie('access_token').redirect('/u/login');
}

function validateResetPassword(password){
    return Joi.object({
        current_password: Joi.string().min(8).required(),
        new_password: Joi.string().min(8).required(),
        confirm_new_password: Joi.string().min(8).required()
    }).validate(password);
}

function userinfo(req, error, action = 'register') {
    if (action === 'login') return {
        error,
        username: req.body.username
    }
    return  { 
        error,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        address: req.body.address 
    }
}