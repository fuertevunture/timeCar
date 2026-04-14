const db = require('./db');
const User = require('../models/user');

class UserRepository {
    getAllUsers() {
        return new Promise((resolve, reject) => {
            db.getDB().all('SELECT * FROM users', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const users = rows.map(row => new User(row.id, row.name, row.email));
                    resolve(users);
                }
            });
        });
    }

    checkUserExist(userInfo) {
        return new Promise((resolve, reject) => {
            db.getDB().get('SELECT no from survey_data where email = ? or phone = ? ', [userInfo.email, userInfo.phone], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            })
        })
    }
}

module.exports = new UserRepository();