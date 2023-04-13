const { Annonce, annonceValid } = require('../models/Annonce');
const debug = require('debug')('annonce-app:dashController')

exports.dashboard = (req,res) => {
    res.render('dashboard/index')
}


// annonces actions

exports.indexAnnonce = async (req, res) => {
    const annonces = await Annonce.find({ 'user._id': req.user._id }).sort('dateDep');
    return res.render('dashboard/annonce/index', {annonces});
}


exports.createAnnonce = (req, res) => {
    return res.render('dashboard/annonce/create', {
        error: null,
        reference: null,
        title: null,
        description: null,
        category: null,
        price: null,
        achatVente: null
    });
}


exports.storeAnnonce = async (req, res) => {
    const { error } = annonceValid(req.body);
    if (error) return res.status(400).render('dashboard/annonce/create', annonceinfo(req, error.message));

    let annonce = await Annonce.findOne({ reference: req.body.reference});
    if (annonce) return res.status(400).render('dashboard/annonce/create', annonceinfo(req, 'Err. duplicate reference !'));

    annonce = new Annonce({
        reference: req.body.reference,
        user: {
            _id: req.user._id,
            username: req.user.username
        },
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        achatVente: req.body.achatVente
    });

    try {
        await annonce.save();
    } catch (ex) {
        debug(ex.message);
        return res.status(500).render('dashboard/annonce/create', annonceinfo(req, 'An error occured on server'));
    }
    return res.redirect('/dashboard/annonces');
}


exports.editAnnonce = async (req, res) => {
    const { ref } = req.params;
    const annonce = await Annonce.findOne({ reference: ref });
    if (!annonce) return res.render('fallback/404');

    return res.render('dashboard/annonce/edit', {
        annonce,
        error: null,
        reference: null,
        title: null,
        description: null,
        category: null,
        price: null,
        achatVente: null
    });
}


exports.updateAnnonce = async (req, res) => {
    const { ref } = req.params;
    const annonce = await Annonce.findOne({ reference: ref });
    if (!annonce) return res.render('fallback/404');
    const { error } = annonceValid(req.body);
    if (error) return res.status(400).render('dashboard/annonce/edit', annonceinfo(req, error.message));

    annonce.title = req.body.title;
    annonce.description = req.body.description;
    annonce.category = req.body.category;
    annonce.price = req.body.price;
    annonce.achatVente = req.body.achatVente;

    try {
        await annonce.save();
    } catch (ex) {
        return res.status(500).render('dashboard/annonce/create', annonceinfo(req, 'An error occured on server'));
    }
    return res.redirect('/dashboard/annonces');
}


exports.destroyAnnonce = async (req, res) => {
    const { ref } = req.params;
    const { deletedCount } = await Annonce.deleteOne({ reference: ref });
    if (!deletedCount) return res.render('fallback/404');
    
    return res.redirect('/dashboard/annonces');
}


function annonceinfo(req, error, annonce = null) {
    return {
        error,
        annonce,
        reference: req.body.reference,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        achatVente: req.body.achatVente
    }
}