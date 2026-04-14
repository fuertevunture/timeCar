const userService = require('../services/userService');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async checkUserExist(req, res) {
        try {
            const user = await userService.checkUserExist(req.query.userInfo);
            res.json(user);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = new UserController();