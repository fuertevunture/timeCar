const indexService = require('../services/indexService');

class IndexController {
    async getAll(req, res) {
        try {
            const all = await indexService.getAll(req.query.no);
            res.json(all);
        } catch (error) {
            res.status(500).json({error: error});
        }
    }
}

module.exports = new IndexController();