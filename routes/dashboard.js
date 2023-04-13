const express = require('express');
const checkAuth = require('../middlware/checkAuth')
const { 
    dashboard,
    indexAnnonce, createAnnonce,
    editAnnonce, storeAnnonce,
    updateAnnonce, destroyAnnonce
} = require('../controllers/DashboardController');
const { profile } = require('../controllers/UserController');

const router = express();

router.get('/', dashboard);
router.get('/me', profile);

// annonces routes
router.get('/annonces', indexAnnonce);
router.get('/annonces/create', createAnnonce);
router.get('/annonces/:ref', editAnnonce);
router.post('/annonces/create', storeAnnonce);
router.put('/annonces/:ref', updateAnnonce);
router.delete('/annonces/:ref', destroyAnnonce);


module.exports = router;