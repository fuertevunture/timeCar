const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    this.db = new sqlite3.Database('./time.db', (err) => {
      if (err) {
        console.error("数据库连接失败:", err.message);
      } else {
        console.log("已成功连接到SQLite数据库");
        this.initTables();
      }
    });
  }

  initTables() {
    this.db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )`);
  }

  getDB() {
    return this.db;
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error("数据库关闭失败:", err.message);
      } else {
        console.log("数据库已关闭");
      }
    });
  }
}

module.exports = new Database();