const models = require('../../models');
const list = require('./../utils/util');

async function create(data) {
    console.log('data', data);
    // const options = list.buildQuery(query);
     let products = await models.product.create({
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
    });
     
    console.log('products', products)

    return {
        data: products,
    }

}

exports.create = create;
