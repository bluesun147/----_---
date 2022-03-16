const express = require('express');
const router = express.Router();
//const template = require('../lib/template');

router.get('/', (req, res) => { // 홈
    const title = 'Home Page';

    const list = req.list;

    res.render('index', { // views/index.hbs
        title,
        list
    })
});

module.exports = router;