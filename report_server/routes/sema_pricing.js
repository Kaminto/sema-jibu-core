const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const pricing = require('../models').pricing;
const kiosk = require('../models').kiosk;
const pricing_scheme = require('../models').pricing_scheme;
const Sequelize = require('sequelize');
const Op = Sequelize.Op
/* GET Pricing in the database. */
router.get('/', function (req, res) {
    semaLog.info('Pricing - Enter');
    pricing.findAndCountAll().then((pricing, count) => {
        res.status(200).json({ data: pricing, total: count });
    });
});

router.get('/:kiosk_id', function (req, res) {

    pricing_scheme.hasMany(pricing);
    semaLog.info('Promotion - Enter');
    let kiosk_id = req.params.kiosk_id;
    pricing_scheme.findAll(
        {
            where: {
                kiosk_id
            },
            include: [
                {
                    where: {
                        start_date: { [Op.lte]: new Date() },
                        end_date: { [Op.gte]: new Date() }
                    },
                    model: pricing
                },]
        }

    ).then((result) => {
        if (result.length > 0) {
            let pricing = result[0].pricings.map(element => {
                return {
                    id: element.id,
                    currencyCode: element.price_currency,
                    priceAmount: element.price_amount,
                    cogsAmount: element.cogs_amount,
                    productId: element.product_id,
                    salesChannelId: element.sales_channel_id,
                    siteId: kiosk_id,
                    active: element.active,
                    start_date: element.start_date,
                    end_date: element.end_date,
                    created_at: element.created_at,
                    updated_at: element.updated_at,
                }
            })

            let schema = result.map(element => {
                return {
                    id: element.id,
                    name: element.name,
                    description: element.description,
                    region_id: element.region_id,
                    kiosk_id: element.kiosk_id,
                    active: element.active,
                    created_at: element.created_at,
                    updated_at: element.updated_at,
                }
            })

           return res.status(200).json({ schema, pricing });
        }

        return res.status(200).json({ pricing: [] });

    });
});

router.post('/', function (req, res, next) {
    semaLog.info(req.body);
    req.check('sales_channel_id', 'Parameter sales_channel_id is missing').exists();
    req.check('product_id', 'Parameter product_id is missing').exists();
    req.check('applies_to', 'Parameter applies_to is missing').exists();
    req.check('start_date', 'Parameter start_date is missing').exists();
    req.check('cogs_amount', 'Parameter cogs_amount is missing').exists();
    req.check('price_currency', 'Parameter price_currency is missing').exists();
    req.check('pricing_scheme_id', 'Parameter pricing_scheme_id is missing').exists();
    req.check('end_date', 'Parameter end_date is missing').exists();
    req.check('price_amount', 'Parameter price_amount is missing').exists();


    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error(
                'CREATE pricing: Validation error: ' + errors.toString()
            );
            res.status(400).send(errors.toString());
        } else {

            pricing.create(req.body).then(promotion => {
                res.status(200).json(promotion);
            })
                .catch(Sequelize.ForeignKeyConstraintError, function handleError() {
                    res.status(400).json({ message: 'Invalid Assignment Error' });
                })
                .catch(next);
        }
    })


});

module.exports = router;
