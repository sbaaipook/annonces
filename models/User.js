const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        maxlength: 500,
        required: true,
        unique: true
    },
    address: {
        type: String,
        maxlength: 500,
        required: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    }
})
userSchema.methods.genAuthToken = function () {
    return jwt.sign({ 
        _id: this._id,
        username: this.username
    }, config.get('privats.secret_key'));
}


const User = mongoose.model('User', userSchema);


function validUser (user, action = 'register') {
    if (action === 'login') return Joi.object({
        username: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(8).required()
    }).validate(user);
    return Joi.object({
        email: Joi.string().max(500).email().required(),
        username: Joi.string().min(3).max(255).required(),
        address: Joi.string().max(500).required(),
        password: Joi.string().min(8).required(),
        confirm_password: Joi.string().min(8).required()
    }).validate(user);
}
module.exports = {
    User,
    validUser
}