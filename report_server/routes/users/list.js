const models = require('../../models');
const list = require('./../utils/util');

async function listAllUsers(query) {
    const options = list.buildQuery(query);
    let users = await models.user.findAndCountAll(options);
    let userData = await Promise.all(
        users.rows.map(async user => {
            user = await user.toJSON();
            return { ...user, role: user.role.length === 0 ? 'N/A' : user.role[0].authority }
        })
    );
    return {
        data: userData,
        total: users.count
    }

}

exports.listAllUsers = listAllUsers;
