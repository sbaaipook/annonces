const { Annonce } = require("../models/Annonce");


exports.index = async (req, res) => {
    const annonces = await Annonce.find().sort('title');
    if (req.user) return res.render('index', { auth: true, annonces});
    return res.render('index', { auth: null, annonces });
}