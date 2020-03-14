const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const kioskClosingStockModal = require('../models').kiosk_closing_stock;

const sqlSiteIdOnly =
    'SELECT * ' +
    'FROM kiosk_closing_stock ' +
    "WHERE kiosk_id = ? AND active = b'1'";

const sqlBeginDateOnly =
    'SELECT * ' +
    'FROM kiosk_closing_stock ' +
    "WHERE kiosk_id = ? AND active = b'1'" +
    'AND created_at >= ?';

const sqlEndDateOnly =
    'SELECT * ' +
    'FROM kiosk_closing_stock ' +
    "WHERE kiosk_id = ? AND active = b'1'" +
    'AND created_at <= ?';

const sqlBeginEndDate =
    'SELECT * ' +
    'FROM kiosk_closing_stock ' +
    "WHERE kiosk_id = ? AND active = b'1'" +
    'AND created_at BETWEEN ? AND ?';

 
router.put('/:closingStockId', async (req, res) => {
    semaLog.info('PUT kiosk_closing_stock - Enter');
    req.check('closingStockId', 'Parameter closingStockId is missing').exists();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('PUT kiosk_closing_stock, Validation error' + errors.toString());
            res.status(400).send(errors.toString());
        } else {
            semaLog.info('ClosingStockId: ' + req.params.closingStockId);
            semaLog.info('body: ', req.body);
            kioskClosingStockModal.update(req.body, { where: { closingStockId: req.params.closingStockId } }).then(result => {
                res.status(200).json(result);
            })
                .catch((err) => {
                    res.status(400).json({ message: 'Invalid Assignment Error' });
                });
        }
    });
});

router.post('/', async (req, res) => {
    semaLog.info('CREATE closingStock - Enter');
    req.check('closingStockId', 'Parameter closingStockId is missing').exists();
    req.check('kiosk_id', 'Parameter kiosk_id is missing').exists();
    req.check('product_id', 'Parameter product_id is missing').exists();
    req.check('quantity', 'Parameter quantity is missing').exists();
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error(
                'CREATE sema_closing stock: Validation error: ' + errors.toString()
            );
            res.status(400).send(errors.toString());
        } else {
            semaLog.info('req.body', { ...req.body, active: 1 });
            kioskClosingStockModal.create({ ...req.body, active: 1, created_at: req.body.created_at }).then(result => {
                res.status(200).json(result);
            })
                .catch((err) => {
                    console.log('err', err)
                    res.status(400).json({ message: 'Invalid Assignment Error' });
                });

        }
    });
});


router.get('/:kiosk_id/:date', function (req, res) {
    semaLog.info('GET Credits - Enter');
    let kiosk_id = req.params.kiosk_id;
    let date = req.params.date;

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('GET Credits validation error: ', errors);
            res.status(400).send(errors.toString());
        } else {

            kioskClosingStockModal.findAll({
                where: {
                    kiosk_id: kiosk_id,
                    created_at: {
                        gte: date
                    },
                }
            }).then(closingStock => {
                res.status(200).json({ closingStock });
            })
                .catch(function (err) {
                    console.log("err", err);
                    res.status(400).json({ error: err });
                });

        }
    });
});


module.exports = router;
