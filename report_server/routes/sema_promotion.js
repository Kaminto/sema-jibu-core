const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const promotion = require('../models').promotion;
const kiosk = require('../models').kiosk;
const Op = Sequelize.Op
/* GET Promotion in the database. */

router.get('/', function (req, res) {

    kiosk.hasMany(promotion);
    semaLog.info('Promotion - Enter');
    kiosk.findAll(
        {

            include: [
                {
                    model: promotion
                },]
        }

    ).then((promotion) => {
        res.status(200).json({ promotion });
    });
});

router.get('/:kiosk_id', function (req, res) {

    kiosk.hasMany(promotion);
    semaLog.info('Promotion - Enter');
    let kiosk_id = req.params.kiosk_id;
    kiosk.findAll(
        {

            include: [
                {
                    where: {
                        kiosk_id,
                        start_date: { [Op.lte]: new Date() },
                        end_date: { [Op.gte]: new Date() }
                    },
                    model: promotion
                },]
        }

    ).then((promotion) => {
        res.status(200).json({ promotion });
    });
});

router.post('/', function (req, res, next) {
    semaLog.info(req.body);
    req.check('type', 'Parameter type is missing').exists();
    req.check('sku', 'Parameter sku is missing').exists();
    req.check('region_id', 'Parameter region_id is missing').exists();
    req.check('kiosk_id', 'Parameter kiosk_id is missing').exists();
    // req.check('product_id', 'Parameter product_id is missing').exists();
    req.check('end_date', 'Parameter end_date is missing').exists();
    req.check('start_date', 'Parameter start_date is missing').exists();
    //req.check('base64encoded_image', 'Parameter base64encoded_image is missing').exists();
    req.check('applies_to', 'Parameter applies_to is missing').exists();
    req.check('amount', 'Parameter amount is missing').exists();


    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error(
                'CREATE promotion: Validation error: ' + errors.toString()
            );
            res.status(400).send(errors.toString());
        } else {

            promotion.create(req.body).then(promotion => {
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
