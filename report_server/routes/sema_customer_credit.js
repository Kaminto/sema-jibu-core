const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const customerCreditModel = require('../models').customer_credit;
const Sequelize = require('sequelize');


const sqlSiteIdOnly =
    'SELECT * ' +
    'FROM customer_credit ' +
    "WHERE customer_account_id = ? AND active = b'1'";

const sqlAllTopups =
    'SELECT * ' +
    'FROM customer_credit ' +
    "WHERE active = b'1'";


const sqlBeginDateOnly =
    'SELECT * ' +
    'FROM customer_credit ' +
    "WHERE customer_account_id = ? AND active = b'1'" +
    'AND created_at >= ?';
const sqlEndDateOnly =
    'SELECT * ' +
    'FROM customer_credit ' +
    "WHERE customer_account_id = ? AND active = b'1'" +
    'AND created_at <= ?';
const sqlBeginEndDate =
    'SELECT * ' +
    'FROM customer_credit ' +
    "WHERE customer_account_id = ? AND active = b'1'" +
    'AND created_at BETWEEN ? AND ?';
const sqlupdated_at =
    'SELECT * ' +
    'FROM customer_credit ' +
    'WHERE customer_account_id = ? ' +
    'AND updated_at > ?';


    const sqlAllTopsupdated_at =
    'SELECT * ' +
    'FROM customer_credit ' +
    'WHERE  updated_at > ?';


///
const sqlDeleteTopUp = 'DELETE FROM customer_credit WHERE top_up_id = ?';
const sqlGetTopUpById = 'SELECT * FROM customer_credit WHERE top_up_id = ?';

const sqlInsertTopUp =
    'INSERT INTO customer_credit ' +
    '(topUpId, created_at, customer_account_id, topup, balance, active ) ' +
    'VALUES (?, ?, ?, ?, ?, ?)';

// const sqlUpdateTopUp = 	"UPDATE customer_credit " +
// 	"SET name = ?, sales_channel_id = ?, customer_type_id = ?," +
// 		"due_amount = ?, address_line1 = ?, gps_coordinates = ?, " +
// 		"phone_number = ?, active = ? " +
// 	"WHERE id = ?";
const sqlUpdateTopUp =
    'UPDATE customer_credit ' +
    'SET topup = ?, balance = ?,active = ? ' +
    'WHERE id = ?';

router.put('/:id', async (req, res) => {
    semaLog.info('PUT customer_credit - Enter');
    req.check('id', 'Parameter id is missing').exists();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('PUT customer, Validation error' + errors.toString());
            res.status(400).send(errors.toString());
        } else {
            semaLog.info('TopUpId: ' + req.params.id);
            findTopUp(sqlGetTopUpById, [req.params.id]).then(
                function (result) {


                    let customerParams = [
                        req.body.topup ? req.body.topup : result.topup,
                        req.body.balance ? req.body.balance : result.balance,
                        receipt_id ? req.body.receipt_id : result.receipt_id,
                    ];

                    // Active is set via a 'bit;
                    if (!req.body.active ? req.body.active : result.active) {
                        customerParams.push(0);
                    } else {
                        customerParams.push(1);
                    }
                    customerParams.push(req.params.id);
                    updateTopUp(
                        sqlUpdateTopUp,
                        customerParams,
                        res
                    );
                },
                function (reason) {
                    res.status(404).send(
                        'PUT customer: Could not find customer with id ' +
                        req.params.id
                    );
                }
            );
        }
    });
});

const updateTopUp = (query, params, res) => {


    customerCreditModel.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.UPDATE }).then(result => {
        if (Array.isArray(result) && result.length >= 1) {
            semaLog.info('updateTopUp - succeeded');
            res.json(result);
        } else {
            res.json([]);
        }
    });


};

router.delete('/:id', async (req, res) => {
    semaLog.info('DELETE sema_customer - Enter');

    semaLog.info(req.params.id);

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('Delete customer. Validation error');
            res.status(400).send(errors.toString());
        } else {
            findTopUp(sqlGetTopUpById, [req.params.id]).then(
                function (result) {
                    console.log(result);
                    semaLog.info('result - Enter', result);

                    deleteTopUp(sqlDeleteTopUp, [req.params.id], res);
                },
                function (reason) {
                    res.status(404).send(
                        'Delete customer. Could not find customer with that id'
                    );
                }
            );
        }
    });
});

const findTopUp = (query, params) => {
    return new Promise((resolve, reject) => {

        customerCreditModel.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.SELECT }).then(result => {
            if (Array.isArray(result) && result.length >= 1) {
                resolve(result);
            } else {
                resolve([]);
            }
        });

    });
};

const deleteTopUp = (query, params, res) => {

    customerCreditModel.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.DELETE }).then(result => {
        if (Array.isArray(result) && result.length >= 1) {
            res.json({ topup: result });
        } else {
            res.json([]);
        }
    }).catch(error => {
        console.log(error);
        res.status(500).send('TopUp Delete - failed');
    });

};
 
router.post('/', async (req, res) => {
    semaLog.info('CREATE sema_customer - Enter');
    semaLog.info(req.body);
    req.check('topUpId', 'Parameter topUpId is missing').exists();
    req.check('customer_account_id', 'Parameter customer_account_id is missing').exists();
    req.check('topup', 'Parameter topup is missing').exists();
    req.check('balance', 'Parameter balance is missing').exists();
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

            customerCreditModel.create({ ...req.body, active: 1, created_at: req.body.created_at }).then(result => {
                res.status(200).json(result);
            })
                .catch((err) => {
                    console.log('err', err)
                    res.status(400).json({ message: 'Invalid Assignment Error' });
                });

        }
    });
});

const insertTopUp = (query, params, res) => {
    customerCreditModel.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.INSERT }).then(result => {
        if (Array.isArray(result) && result.length >= 1) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).catch(function (error) {
        semaLog.error('TopUp - failed', { error });
        res.status(500).send('TopUp - failed');
    });

};


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

            customerCreditModel.findAll({
                where: {
                    kiosk_id: kiosk_id,
                    created_at: {
                        gte: date
                    },
                }
            }).then(topup => {
                res.status(200).json({ topup: topup });
            })
                .catch(function (err) {
                    console.log("err", err);
                    res.status(400).json({ error: err });
                });

        }
    });
});

router.get('/allTopUps', function (req, res) {
    semaLog.info('GET allTopUps - Enter');


    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('GET Credits validation error: ', errors);
            res.status(400).send(errors.toString());
        } else {
            if (req.query.hasOwnProperty('updated-date')) {
                let updated_at = getUTCDate(
                    new Date(req.query['updated-date'])
                );

                if (!isNaN(updated_at)) {
                    getTopUps(
                        sqlAllTopsupdated_at,
                        [updated_at],
                        res
                    );
                } else {
                    semaLog.error('GET Credits - Invalid updated_at');
                    res.status(400).send('Invalid Date');
                }
            } else if (
                req.query.hasOwnProperty('begin-date') &&
                req.query.hasOwnProperty('end-date')
            ) {
                let beginDate = getUTCDate(new Date(req.query['begin-date']));
                let endDate = getUTCDate(new Date(req.query['end-date']));
                if (!isNaN(beginDate) && !isNaN(endDate)) {
                    getTopUps(
                        sqlBeginEndDate,
                        [beginDate, endDate],
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
                    getTopUps(
                        sqlBeginDateOnly,
                        [beginDate],
                        res
                    );
                } else {
                    semaLog.error('GET Credits - Invalid begin-date');
                    res.status(400).send('Invalid Date');
                }
            } else if (req.query.hasOwnProperty('end-date')) {
                let endDate = getUTCDate(new Date(req.query['end-date']));
                if (!isNaN(endDate)) {
                    getTopUps(
                        sqlEndDateOnly,
                        [endDate],
                        res
                    );
                } else {
                    semaLog.error('GET Credits - Invalid end-date');
                    res.status(400).send('Invalid Date');
                }
            } else {
                getTopUps(sqlAllTopups, [], res);
            }
        }
    });
});

const getTopUps = (query, params, res) => {
    semaLog.info('GET getTopUps - Enter');

    customerCreditModel.sequelize.query(query, { raw: true, replacements: params, type: Sequelize.QueryTypes.SELECT }).then(result => {
        if (Array.isArray(result) && result.length >= 1) {
            var values = result.map(item => {
                item.active = item['active'][0] === 1 ? true : false;
                return item;
            });

            res.json({ topup: values });
        } else {
            res.json({ topup: [] });
        }
    }).catch(function (err) {
        console.log(err)
        res.json({ topup: err });
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
