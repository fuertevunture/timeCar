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

  getUserById(id) {
    return new Promise((resolve, reject) => {
      db.getDB().get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(new User(row.id, row.name, row.email));
        }
      });
    });
  }

  createUser(name, email) {
    return new Promise((resolve, reject) => {
      db.getDB().run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  updateUser(id, name, email) {
    return new Promise((resolve, reject) => {
      db.getDB().run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.getDB().run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}

module.exports = new UserRepository();