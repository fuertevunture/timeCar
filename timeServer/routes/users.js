var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.getAllUsers);

router.get('/exist',userController.checkUserExist);

module.exports = router;
