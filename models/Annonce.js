const Joi = require('joi');
const mongoose = require('mongoose');
const Annonce = mongoose.model('Annonce', new mongoose.Schema({
    reference: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: new mongoose.Schema({
            username: {
                type: String,
                minlength: 3,
                maxlength: 255,
                required: true,
                trim: true,
            },
        }),
        required: true
    },
    title: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    description: {
        type: String,
        minlength: 15,
        maxlength: 150,
    },
    category: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    dateDep: {
        type: Date,
        default: Date.now
    },
    achatVente: {
        type: [String],
        required: true
    }
}))

function annonceValid(annonce){
    return Joi.object({
        reference: Joi.string().required(),
        user: {
            _id: Joi.objectId(),
            username: Joi.string().required()
        },
        title: Joi.string().min(5).max(255).required(),
        description: Joi.string().min(15).max(150).required(),
        category: Joi.array().required(),
        price: Joi.number().required(),
        achatVente: Joi.array().required()
    }).validate(annonce)
}

module.exports = {
    Annonce, annonceValid
}