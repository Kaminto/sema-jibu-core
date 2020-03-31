const models = require("../../models");

function findByPk(id) {
    return models.product.findByPk(id).then(async result => {
        result = await result.toJSON();
        return { ...result };
    });
}
exports.findByPk = findByPk;