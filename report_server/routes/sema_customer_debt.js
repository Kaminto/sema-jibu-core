const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const customerDebtModal = require('../models').customer_debt;


const sqlDeleteDebt = 'DELETE FROM customer_debt WHERE customer_debt_id = ?';
const sqlGetDebtById = 'SELECT * FROM customer_debt WHERE customer_debt_id = ?';

const sqlInsertDebt =
    'INSERT INTO customer_debt ' +
    '(customer_debt_id, created_at, customer_account_id, due_amount, kiosk_id, active ) ' +
    'VALUES (?, ?, ?, ?, ?, ?)';

router.put('/:customer_debt_id', async (req, res) => {
    semaLog.info('PUT customer_debt - Enter');
    req.check('customer_debt_id', 'Parameter customer_debt_id is missing').exists();
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('PUT customer, Validation error' + errors.toString());
            res.status(400).send(errors.toString());
        } else {
            semaLog.info('DebtId: ' + req.params.customer_debt_id);
            findDebt(sqlGetDebtById, [req.params.customer_debt_id]).then(
                function (result) {
                    // Active is set via a 'bit;
                    let active = 0;
                    if (!req.body.active ? req.body.active : result.active) {
                        active = 0;
                    } else {
                        active = 1;
                    }
                    customerDebtModal.update({
                        due_amount: req.body.due_amount ? req.body.due_amount : result.due_amount,
                        balance: req.body.balance,
                        active
                    },
                        { where: { customer_debt_id: req.params.customer_debt_id } }
                    ).then(result => {
                        if (Array.isArray(result) && result.length >= 1) {
                            semaLog.info('updateDebt - succeeded');
                            res.json(result);
                        } else {
                            res.json([]);
                        }
                    });
                },
                function (reason) {
                    res.status(404).send(
                        'PUT customer DEBT: Could not find customer debt with id ' +
                        req.params.customer_debt_id
                    );
                }
            );
        }
    });
});

router.delete('/:customer_debt_id', async (req, res) => {
    semaLog.info('DELETE sema_customer - Enter');

    semaLog.info(req.params.customer_debt_id);

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error('Delete customer. Validation error');
            res.status(400).send(errors.toString());
        } else {
            findDebt(sqlGetDebtById, [req.params.customer_debt_id]).then(
                function (result) {
                    console.log(result);
                    semaLog.info('result - Enter', result);

                    deleteDebt(sqlDeleteDebt, [req.params.customer_debt_id], res);
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

const findDebt = (query, params) => {
    return new Promise((resolve, reject) => {

        customerDebtModal.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.SELECT }).then(result => {
            if (Array.isArray(result) && result.length >= 1) {
                resolve(result);
            } else {
                resolve([]);
            }
        });

    });
};

const deleteDebt = (query, params, res) => {

    customerDebtModal.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.DELETE }).then(result => {
        if (Array.isArray(result) && result.length >= 1) {
            res.json({ topup: result });
        } else {
            res.json([]);
        }
    }).catch(error => {
        console.log(error);
        res.status(500).send('Debt Delete - failed');
    });

};

router.post('/', async (req, res) => {
    semaLog.info('CREATE sema_customer - Enter');
    semaLog.info(req.body);
    req.check('customer_debt_id', 'Parameter customer_debt_id is missing').exists();
    req.check('customer_account_id', 'Parameter customer_account_id is missing').exists();
    req.check('due_amount', 'Parameter due_amount is missing').exists();
    req.check('kiosk_id', 'Parameter kiosk_id is missing').exists();
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

            customerDebtModal.create({ ...req.body, active: 1 }).then(result => {
                res.status(200).json(result);
            })
                .catch((err) => {
                    console.log('err', err)
                    res.status(400).json({ message: 'Invalid Assignment Error' });
                });

        }
    });
});


router.get('/:kiosk_id/:date', (req, res) => {
    semaLog.info('GET Debts - Enter');
    let kiosk_id = req.params.kiosk_id;
    let date = req.params.date;
    customerDebtModal.findAll({
        where: {
            kiosk_id: kiosk_id,
            created_at: {
                gte: date
            }
        },
    }).then(result => res.send(result));
});

module.exports = router;
