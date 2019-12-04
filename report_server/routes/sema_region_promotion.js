const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const region_promotion = require('../models').region_promotion;

/* GET Region Promotion in the database. */
router.get('/', function (req, res) {
    semaLog.info('Region Promotion - Enter');
    region_promotion.findAndCountAll().then((regionPromotion, count) => {
        res.status(200).json({ data: regionPromotion, total: count });
    });
});

router.post('/', function (req, res, next) {
    semaLog.info(req.body);
    req.check('kiosk_id', 'Parameter kiosk_id is missing').exists();
    req.check('region_id', 'Parameter region_id is missing').exists();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error(
                'CREATE region_promotion: Validation error: ' + errors.toString()
            );
            res.status(400).send(errors.toString());
        } else {

            region_promotion.create(req.body).then(regionPromotion => {
                res.status(200).json(regionPromotion);
            })
                .catch(Sequelize.ForeignKeyConstraintError, function handleError() {
                    res.status(400).json({ message: 'Invalid Assignment Error' });
                })
                .catch(next);
        }
    })


});

module.exports = router;
