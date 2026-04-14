const db = require('./db');

class IndexRepository {
    getAll(no) {
        return new Promise((resolve, reject) => {
            db.getDB().get("select * from survey_data where no = ?",[no], (err, data) => {
                if (err) {
                    return reject(err);
                }else {
                    return resolve(data);
                }
            })
        })
    }
}

module.exports = new IndexRepository();