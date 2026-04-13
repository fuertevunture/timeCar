var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.getAllUsers);

/* GET user by id. */
router.get('/:id', userController.getUserById);

/* POST create user. */
router.post('/', userController.createUser);

/* PUT update user. */
router.put('/:id', userController.updateUser);

/* DELETE delete user. */
router.delete('/:id', userController.deleteUser);

module.exports = router;
