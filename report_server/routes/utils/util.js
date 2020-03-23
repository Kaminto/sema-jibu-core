const ramda = require("ramda");
const sequelize = require("sequelize");
function buildQuery(query = {}) {
    const options = ramda.mergeDeepRight(ramda.mergeDeepRight(sort(query), paginate(query)), ramda.mergeDeepRight(filter(query), byIds(query)));
    return options;
}
exports.buildQuery = buildQuery;
function paginate(query) {
    if (query.page && query.perPage) {
        const limit = parseInt(query.perPage);
        const page = parseInt(query.page);
        const offset = limit * (page - 1);
        return { offset, limit };
    }
    return {};
}
exports.paginate = paginate;
function sort(query) {
    if (query.field) {
        return {
            order: [[query.field, query.order || "ASC"]]
        };
    }
    return {};
}
exports.sort = sort;
function filter(query) {
    if (query.filter) {
        if (!query.filter.hasOwnProperty('customfilter')) {
            return {
                where: Object.assign({}, query.filter)
            };
        }
    }
    return {};
}
exports.filter = filter;
function byIds(query) {
    if (query.ids) {
        return {
            where: {
                id: {
                    [sequelize.Op.in]: ramda.values(query.ids)
                }
            }
        };
    }
    return {};
}
exports.byIds = byIds;