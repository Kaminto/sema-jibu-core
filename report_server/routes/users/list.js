const models = require('../../models');
const list = require('./../utils/util');

async function listAllUsers(query) {
    console.log('options', query);
    const options = list.buildQuery(query);
    console.log('options', options);
    let users = await models.user.findAndCountAll(options);
    let userData = await Promise.all(
        users.rows.map(async user => {
            user = await user.toJSON();
            return {
                ...user, role: user.role.length === 0 ? 'N/A' : user.role[0].id,
                searchString: user.firstName + ' ' + user.lastName + ' ' + user.lastName
            }
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

async function listNoQuery() {
    return listAllUsers({});
}
exports.listNoQuery = listNoQuery;
exports.listAllUsers = listAllUsers;
