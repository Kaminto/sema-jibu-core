const models = require('../../models');
const list = require('./../utils/util');

async function listAll(query) {
    const options = list.buildQuery(query);
    let users = await models.role.findAndCountAll(options);
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

async function listAllDropDown() {
    // const options = list.buildQuery({ page: '1', perPage: '25', field: 'id', order: 'DESC' });
    // let users = await models.role.findAndCountAll(options);
    // let userData = await Promise.all(
    //     users.rows.map(async user => {
    //         user = await user.toJSON();
    //         return { ...user }
    //     })
    // );
    // return {
    //     data: userData,
    //     total: users.count
    // }
   return listAll({})

}


exports.listAllDropDown = listAllDropDown;
exports.listAll = listAll;
