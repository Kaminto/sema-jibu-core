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

const sqlUpdatedDate =
    'SELECT * ' +
    'FROM kiosk_closing_stock ' +
    'WHERE kiosk_id = ? ' +
    'AND updated_at > ?';

const sqlAllTopsUpdatedDate =
    'SELECT * ' +
    'FROM kiosk_closing_stock ' +
    'WHERE  updated_at > ?';


///
const sqlDeleteClosingStock = 'DELETE FROM kiosk_closing_stock WHERE closingStockId = ?';
const sqlGetClosingStockById = 'SELECT * FROM kiosk_closing_stock WHERE closingStockId = ?';

const sqlInsertClosingStock =
    'INSERT INTO kiosk_closing_stock ' +
    '(closingStockId, created_at, kiosk_id, product_id, quantity, active ) ' +
    'VALUES (?, ?, ?, ?, ?, ?)';

const sqlUpdateClosingStock =
    'UPDATE kiosk_closing_stock ' +
    'SET quantity = ?, active = ? ' +
    'WHERE closingStockId = ?';

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
            findClosingStock(sqlGetClosingStockById, [req.params.closingStockId]).then(
                function (result) {


                    let closingStockParams = [
                        req.body.quantity ? req.body.quantity : result.quantity
                    ];

                    // Active is set via a 'bit;
                    if (!req.body.active ? req.body.active : result.active) {
                        closingStockParams.push(0);
                    } else {
                        closingStockParams.push(1);
                    }
                    closingStockParams.push(req.params.closingStockId);
                    updateClosingStock(
                        sqlUpdateClosingStock,
                        closingStockParams,
                        res
                    );
                },
                function (reason) {
                    res.status(404).send(
                        'PUT customer: Could not find customer with closingStockId ' +
                        req.params.closingStockId
                    );
                }
            );
        }
    });
});

const updateClosingStock = (query, params, res) => {


    kioskClosingStockModal.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.UPDATE }).then(result => {
        if (Array.isArray(result) && result.length >= 1) {
            semaLog.info('updateClosingStock - succeeded');
            res.json(result);
        } else {
            res.json([]);
        }
    });


};

router.delete('/:closingStockId', async (req, res) => {
    semaLog.info('DELETE sema_customer - Enter');

    semaLog.info(req.params.closingStockId);

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('Delete customer. Validation error');
            res.status(400).send(errors.toString());
        } else {
            findClosingStock(sqlGetClosingStockById, [req.params.closingStockId]).then(
                function (result) {
                    console.log(result);
                    semaLog.info('result - Enter', result);

                    deleteClosingStock(sqlDeleteClosingStock, [req.params.closingStockId], res);
                },
                function (reason) {
                    res.status(404).send(
                        'Delete customer. Could not find customer with that closingStockId'
                    );
                }
            );
        }
    });
});

const findClosingStock = (query, params) => {
    return new Promise((resolve, reject) => {

        kioskClosingStockModal.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.SELECT }).then(result => {
            if (Array.isArray(result) && result.length >= 1) {
                resolve(result);
            } else {
                resolve([]);
            }
        });

    });
};

const deleteClosingStock = (query, params, res) => {

    kioskClosingStockModal.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.DELETE }).then(result => {
        if (Array.isArray(result) && result.length >= 1) {
            res.json({ closingStock: result });
        } else {
            res.json([]);
        }
    }).catch(error => {
        console.log(error);
        res.status(500).send('ClosingStock Delete - failed');
    });

};

router.post('/', async (req, res) => {
    semaLog.info('CREATE closingStock - Enter');

    //var postSqlParams = [];

    semaLog.info(req.body);
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
                'CREATE sema_customer: Validation error: ' + errors.toString()
            );
            res.status(400).send(errors.toString());
        } else {
            let postSqlParams = [
                req.body.closingStockId,
                getUTCDate(new Date()),
                req.body.kiosk_id,
                req.body.product_id,
                req.body.quantity,
                1,
            ];

            insertClosingStock(sqlInsertClosingStock, postSqlParams, res);
        }
    });
});

const insertClosingStock = (query, params, res) => {
    kioskClosingStockModal.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.INSERT }).then(result => {
        if (Array.isArray(result) && result.length >= 1) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).catch(function (error) {
        semaLog.error('ClosingStock - failed', { error });
        res.status(500).send('ClosingStock - failed');
    });

};


router.get('/', function (req, res) {
    semaLog.info('GET Credits - Enter');


    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('GET Credits validation error: ', errors);
            res.status(400).send(errors.toString());
        } else {
            semaLog.info('kiosk_id: ' + req.query['kiosk_id']);
            if (req.query.hasOwnProperty('updated-date')) {
                let updatedDate = getUTCDate(
                    new Date(req.query['updated-date'])
                );

                if (!isNaN(updatedDate)) {
                    getClosingStock(
                        sqlUpdatedDate,
                        [req.query['kiosk_id'], updatedDate],
                        res
                    );
                } else {
                    semaLog.error('GET Credits - Invalid updatedDate');
                    res.status(400).send('Invalid Date');
                }
            } else if (
                req.query.hasOwnProperty('begin-date') &&
                req.query.hasOwnProperty('end-date')
            ) {
                let beginDate = getUTCDate(new Date(req.query['begin-date']));
                let endDate = getUTCDate(new Date(req.query['end-date']));
                if (!isNaN(beginDate) && !isNaN(endDate)) {
                    getClosingStock(
                        sqlBeginEndDate,
                        [req.query['kiosk_id'], beginDate, endDate],
                        res
                    );
                } else {
                    semaLog.error(
                        'GET Credits - Invalid begin-date/end-date'
                    );
                    res.status(400).send('Invalid Date');
                }
            } else if (req.query.hasOwnProperty('begin-date')) {
                let beginDate = getUTCDate(new Date(req.query['begin-date']));
                semaLog.info(
                    'GET Credits - beginDate: ' + beginDate.toISOString()
                );
                if (!isNaN(beginDate)) {
                    getClosingStock(
                        sqlBeginDateOnly,
                        [req.query['kiosk_id'], beginDate],
                        res
                    );
                } else {
                    semaLog.error('GET Credits - Invalid begin-date');
                    res.status(400).send('Invalid Date');
                }
            } else if (req.query.hasOwnProperty('end-date')) {
                let endDate = getUTCDate(new Date(req.query['end-date']));
                if (!isNaN(endDate)) {
                    getClosingStock(
                        sqlEndDateOnly,
                        [req.query['kiosk_id'], endDate],
                        res
                    );
                } else {
                    semaLog.error('GET Credits - Invalid end-date');
                    res.status(400).send('Invalid Date');
                }
            } else {
                getClosingStock(sqlSiteIdOnly, [req.query['kiosk_id']], res);
            }
        }
    });
});
 

const getClosingStock = (query, params, res) => {
    semaLog.info('GET getClosingStock - Enter');

    kioskClosingStockModal.sequelize.query(query, { raw: true, replacements: params, type: Sequelize.QueryTypes.SELECT }).then(result => {
        if (Array.isArray(result) && result.length >= 1) {
            var values = result.map(item => {
                item.active = item['active'][0] === 1 ? true : false;
                return item;
            });

            res.json({ closingStock: values });
        } else {
            res.json({ closingStock: [] });
        }
    }).catch(function (err) {
        console.log(err)
        res.json({ closingStock: err });
    });
};



const getUTCDate = date => {
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
};

module.exports = router;
