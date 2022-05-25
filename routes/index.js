const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/', (req, res) => res.render('welcome'));


router.get('/dashboard/:name', (req, res)=>{
    res.render('dashboard', {
        name: req.params.name
    })
})

module.exports = router; 