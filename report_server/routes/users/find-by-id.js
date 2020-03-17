const models = require("../../models");

function findUser(id) {
    return models.user.findByPk(id).then(async result => {
        result = await result.toJSON();
        return { ...result, role: result.role.length === 0 ? 'N/A' : result.role[0].authority };
    });
}
exports.findUser = findUser;