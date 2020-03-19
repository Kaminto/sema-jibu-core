const models = require('../../models');
const list = require('./../utils/util');

async function listAll(query) {
    console.log('query',query);
    const options = list.buildQuery(query);
    let users = await models.franchise.findAndCountAll(options);
    let userData = await Promise.all(
        users.rows.map(async user => {
            user = await user.toJSON();
            return { ...user }
        })
    );
    return {
        data: userData,
        total: users.count
    }

}

async function listAllDropDown(query) {
    console.log('listAllDropDown query',query);
    const options = list.buildQuery(query);
    let users = await models.franchise.findAndCountAll();
    let userData = await Promise.all(
        users.rows.map(async user => {
            user = await user.toJSON();
            return { ...user }
        })
    );
    return {
        data: userData,
        total: users.count
    }

}


exports.listAllDropDown = listAllDropDown;
exports.listAll = listAll;
