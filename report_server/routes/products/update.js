const models = require('../../models');
const list = require('../utils/util');

async function update(data, id) {
    let products = await models.product.update({
        base64encoded_image: data.base64Image,
        description: data.description,
        sku: data.sku,
        category_id: data.category_id,
        price_amount: data.priceAmount,
        price_currency: data.priceCurrency,
        unit_measure: data.unitMeasurement,
        cogs_amount: data.costOfGoods,
        unit_per_product: data.unitsPerProduct,
        minimum_quantity: data.minQuantity,
        maximum_quantity: data.maxQuantity,
        name: data.name,
        active: 0
    }, { where: { id: id } });

    return {
        data: products,
    }

}

exports.update = update;
