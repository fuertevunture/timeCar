var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    res.send('Welcome');
});

router.get('/alL', indexController.getAll);

module.exports = router;
