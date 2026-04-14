const indexRepository = require("../repositories/indexRepository")

class IndexService {
    async getAll(no) {
        try {
            return await indexRepository.getAll(no);
        } catch (error) {
            return error;
        }
    }
}

module.exports = new IndexService();