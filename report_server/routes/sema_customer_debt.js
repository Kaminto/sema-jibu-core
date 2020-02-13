const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const customerDebtModel = require('../models').customer_debt;


/* GET Payment Type Credit in the database. */
router.get('/', function (req, res) {
	semaLog.info('Payment Type - Enter');
	customerDebtModel.findAll().then(receiptPaymentType => {
		res.send(receiptPaymentType)
	});
});
 
router.post('/', function (req, res, next) {
	semaLog.info(req.body);
	semaLog.info('Customer Debt - Enter');
	req.check('customer_account_id', 'Parameter customer_account_id is missing').exists();
	req.check('customer_debt_id', 'Parameter customer_debt_id is missing').exists();
	req.check('due_amount', 'Parameter due_amount is missing').exists();


	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error(
				'CREATE Customer Debt: Validation error: ' + errors.toString()
			);
			res.status(400).send(errors.toString());
		} else {

			customerDebtModel.create({...req.body,active: 1}).then(result => {
				res.status(200).json(result);
			})
				.catch(Sequelize.ForeignKeyConstraintError, function handleError() {
					res.status(400).json({ message: 'Invalid Assignment Error' });
				})
				.catch(next);
		}
	})

});


router.delete('/:customer_debt_id', async (req, res) => {
	semaLog.info('DELETE customer_debt - Enter');
	semaLog.info(req.params.customer_debt_id);
	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('Delete Customer Debt. Validation error');
			res.status(400).send(errors.toString());
		} else {
			findCustomerDebt('SELECT * FROM customer_debt WHERE customer_debt_id = ?', [req.params.customer_debt_id]).then(
				function (result) {
					console.log(result);
					semaLog.info('result - Enter', result);

					deleteCustomerDebt('DELETE FROM customer_debt WHERE customer_debt_id = ?', [req.params.customer_debt_id], res);
				},
				function (reason) {
					res.status(404).send(
						'Delete Customer Debt. Could not find customer_debt with that id'
					);
				}
			);
		}
	});
});


const findCustomerDebt = (query, params) => {
	return new Promise((resolve, reject) => {
		customerDebtModel.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.SELECT }).then(result => {
			if (Array.isArray(result) && result.length >= 1) {
				resolve(result);
			} else {
				resolve([]);
			}
		});
	});
};

const deleteCustomerDebt = (query, params, res) => {
	customerDebtModel.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.DELETE }).then(result => {
		if (Array.isArray(result) && result.length >= 1) {
			res.json({ topup: result });
		} else {
			res.json([]);
		}
	}).catch(error => {
		console.log(error);
		res.status(500).send('customerDebt Delete - failed');
	});
};


router.put('/:customer_debt_id', async (req, res) => {
	semaLog.info('PUT customer_credit - Enter');
	req.check('customer_debt_id', 'Parameter customer_debt_id is missing').exists();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('PUT customer, Validation error' + errors.toString());
			res.status(400).send(errors.toString());
		} else {
			semaLog.info('customer_debt_id: ' + req.params.customer_debt_id);
			findCustomerDebt('SELECT * FROM customer_debt WHERE customer_debt_id = ?', [req.params.customer_debt_id]).then(
				function (result) {

					let customerDebtParams = [
						req.body.customer_account_id ? req.body.customer_account_id : result.customer_account_id,
						req.body.due_amount ? req.body.due_amount : result.due_amount,
					];

					  // Active is set via a 'bit;
					  if (!req.body.active ? req.body.active : result.active) {
                        customerParams.push(0);
                    } else {
                        customerParams.push(1);
                    }
					
					customerDebtParams.push(req.params.customer_debt_id);
					const sqlUpdatecustomerDebt =
						'UPDATE customer_debt ' +
						'SET customer_account_id = ?, due_amount = ?, active = ? ' +
						'WHERE customer_debt_id = ?';
					updatecustomerDebt(
						sqlUpdatecustomerDebt,
						customerDebtParams,
						res
					);
				},
				function (reason) {
					res.status(404).send(
						'PUT customerDebt: Could not find customer with customer_debt_id ' +
						req.params.customer_debt_id
					);
				}
			);
		}
	});
});

const updatecustomerDebt = (query, params, res) => {
	customerDebtModel.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.UPDATE }).then(result => {
		if (Array.isArray(result) && result.length >= 1) {
			semaLog.info('updatecustomerDebt - succeeded');
			res.json(result);
		} else {
			res.json([]);
		}
	});
};

module.exports = router;
