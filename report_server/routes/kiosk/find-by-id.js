const models = require("../../models");

function findByPk(id) {
    return models.kiosk.findByPk(id).then(async result => {
        result = await result.toJSON();
        return { ...result };
    });
}
exports.findByPk = findByPk;