const models = require('../../models');
const list = require('./../utils/util');

async function listAll(query) {
    console.log('query', query)
    const options = list.buildQuery(query);
    let users = await models.product.findAndCountAll(options);
    let userData = await Promise.all(
        users.rows.map(async user => {
            user = await user.toJSON();
            return { ...user,
                searchString: user.name + ' ' + user.description }
        })
    );

    if (query.filter) {
        if (query.filter.hasOwnProperty('customfilter')) {
            console.log(userData[0])
            return {
                data: userData.filter(x=> x.searchString.toLowerCase().includes(query.filter.customfilter.toLowerCase())),
                total: users.count
            }
        }
    }

    return {
        data: userData,
        total: users.count
    }

}

async function listAllProducts() {
    return listAll({})
}

exports.listAll = listAll;
exports.listAllProducts = listAllProducts;
