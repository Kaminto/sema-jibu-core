const express = require('express');
const Sequelize = require('sequelize');
var format = require('date-fns/format');
var isSameDay = require('date-fns/isSameDay');
var ug = require('date-fns/locale/ug');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const kioskClosingStockModal = require('../models').kiosk_closing_stock;

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


router.post('/', async (req, res) => {
    semaLog.info('CREATE closingStock - Enter');
    req.check('closingStockId', 'Parameter closingStockId is missing').exists();
    req.check('kiosk_id', 'Parameter kiosk_id is missing').exists();
    req.check('product_id', 'Parameter product_id is missing').exists();
    req.check('quantity', 'Parameter quantity is missing').exists();
    req.getValidationResult().then(async function (result) {
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
            const cj = await findByKioskIdAndWastageName(req.body.kiosk_id, req.body.product_id, req.body.created_at);
            console.log('cj', cj)
            if (cj.length === 0) {
                create({ ...req.body, active: 1, created_at: req.body.created_at }).then(result => {
                    res.status(200).json(result);
                })
                    .catch((err) => {
                        console.log('err', err);
                        res.append('message', 'Contact Support Something not Right');
                        res.sendStatus(400);
                    })
            } else if (cj.length > 0) {
                res.append('message', 'Closing Stock has already been sent');
                res.sendStatus(400);
            }

        }
    });
});


router.put('/:closingStockId', async (req, res) => {
    semaLog.info('PUT kiosk_closing_stock - Enter');
    req.check('closingStockId', 'Parameter closingStockId is missing').exists();

    req.getValidationResult().then(async function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('PUT kiosk_closing_stock, Validation error' + errors.toString());
            res.status(400).send(errors.toString());
        } else {
            semaLog.info('ClosingStockId: ' + req.params.closingStockId);
            semaLog.info('body: ', req.body);

            const cj = await findByKioskIdAndWastageName(req.body.kiosk_id, req.body.product_id, req.body.created_at);
            console.log('cj', cj)
            if (cj.length > 0) {
                delete req.body.id;
                update(req.body, req.params.closingStockId).then(result => {
                    res.status(200).json(result);
                })
                    .catch((err) => {
                        console.log('err', err)
                        res.status(400).json({ message: 'Invalid Assignment Error' });
                    });

            } else if (cj.length === 0) {
                let updated_at = req.body.updated_at;
                delete req.body.updated_at;
                create({ ...req.body, active: 1, closingStockId: req.params.closingStockId, created_at: updated_at }).then(result => {
                    res.status(200).json(result);
                })
                    .catch((err) => {
                        console.log('err', err);
                        res.append('message', 'Contact Support Something not Right');
                        res.sendStatus(400);
                    })
            }


        }
    });
});


function update(body, closingStockId) {
    return kioskClosingStockModal.update(body, { where: { closingStockId } }).then(result => {
        return result;
    })
        .catch((err) => {
            console.log('err', err)
            return { message: 'Invalid Assignment Error' };
        });
}



function create(body) {
    return kioskClosingStockModal.create(body).then(result => {
        return result;
    })
        .catch((err) => {
            console.log('err', err)
            return { message: 'Invalid Assignment Error' };
        });
}


function findByKioskIdAndWastageName(kiosk_id, product_id, date) {
    console.log(kiosk_id + " " + date + " " + product_id)
    return kioskClosingStockModal.findAll({
        where: {
            kiosk_id: kiosk_id,
            product_id
        }
    }).then(result => {
        console.log('result', result);
        let ty = JSON.parse(JSON.stringify(result));
        console.log('ty', ty);
        const er = ty.filter(e => {
            console.log('date', format(new Date(date), 'yyyy-MM-dd'));
            console.log('created_at', format(new Date(e.created_at), 'yyyy-MM-dd'));
            console.log('isSameDay', isSameDay(
                new Date(date),
                new Date(e.created_at)
            ));
            if (isSameDay(
                new Date(date),
                new Date(e.created_at)
            )) {
                return { ...e }
            }
        })
        console.log('er', er);
        return er;
    })
}


module.exports = router;
