const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const receipt_payment_type = require('../models').receipt_payment_type;
const receipt = require('../models').receipt;

/* GET Payment Type Credit in the database. */
router.get('/', function (req, res) {
	semaLog.info('Payment Type - Enter');
	receipt_payment_type.findAll().then(receiptPaymentType => {
		res.send(receiptPaymentType)
	});
});

router.get('ByRecieptId/:receipt_id', function (req, res) {
	semaLog.info('Payment Type - Enter');
	receipt_payment_type.belongsTo(receipt);
	let receipt_id = req.params.receipt_id;
	receipt_payment_type.findAll({
		where: { receipt_id },
		include: [
			{
				model: receipt
			},]
	}).then(receiptPaymentType => {
		res.send(receiptPaymentType)
	});
});

router.get('byRecieptPaymentId/:receipt_payment_type_id', function (req, res) {
	semaLog.info('Payment Type - Enter');
	receipt_payment_type.belongsTo(receipt);
	let receipt_payment_type_id = req.params.receipt_payment_type_id;
	receipt_payment_type.findAll({
		where: { receipt_payment_type_id },
		include: [
			{
				model: receipt
			},]
	}).then(receiptPaymentType => {
		res.send(receiptPaymentType)
	});
});

router.post('/', function (req, res, next) {
	semaLog.info(req.body);
	semaLog.info('Reciept Payment Type - Enter');
	req.check('receipt_id', 'Parameter receipt_id is missing').exists();
	req.check('payment_type_id', 'Parameter payment_type_id is missing').exists();
	req.check('amount', 'Parameter amount is missing').exists();
	req.check('receipt_payment_type_id', 'receipt_payment_type_id amount is missing').exists();


	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error(
				'CREATE Reciept Payment Type: Validation error: ' + errors.toString()
			);
			res.status(400).send(errors.toString());
		} else {

			receipt_payment_type.create({...req.body,active: 1}).then(result => {
				res.status(200).json(result);
			})
				.catch(Sequelize.ForeignKeyConstraintError, function handleError() {
					res.status(400).json({ message: 'Invalid Assignment Error' });
				})
				.catch(next);

		}
	})

});


router.delete('/:receipt_payment_type_id', async (req, res) => {
	semaLog.info('DELETE receipt_payment_type - Enter');

	semaLog.info(req.params.receipt_payment_type_id);

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('Delete receipt_payment_type. Validation error');
			res.status(400).send(errors.toString());
		} else {
			findReceiptPaymentType('SELECT * FROM receipt_payment_type WHERE receipt_payment_type_id = ?', [req.params.receipt_payment_type_id]).then(
				function (result) {
					console.log(result);
					semaLog.info('result - Enter', result);

					deleteReceiptPaymentType('DELETE FROM receipt_payment_type WHERE receipt_payment_type_id = ?', [req.params.receipt_payment_type_id], res);
				},
				function (reason) {
					res.status(404).send(
						'Delete receipt_payment_type. Could not find receipt_payment_type with that id'
					);
				}
			);
		}
	});
});


const findReceiptPaymentType = (query, params) => {
	return new Promise((resolve, reject) => {

		receipt_payment_type.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.SELECT }).then(result => {
			if (Array.isArray(result) && result.length >= 1) {
				resolve(result);
			} else {
				resolve([]);
			}
		});

	});
};

const deleteReceiptPaymentType = (query, params, res) => {

	receipt_payment_type.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.DELETE }).then(result => {
		if (Array.isArray(result) && result.length >= 1) {
			res.json({ topup: result });
		} else {
			res.json([]);
		}
	}).catch(error => {
		console.log(error);
		res.status(500).send('ReceiptPaymentType Delete - failed');
	});

};


router.put('/:receipt_payment_type_id', async (req, res) => {
	semaLog.info('PUT customer_credit - Enter');
	req.check('receipt_payment_type_id', 'Parameter receipt_payment_type_id is missing').exists();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('PUT customer, Validation error' + errors.toString());
			res.status(400).send(errors.toString());
		} else {
			semaLog.info('ReceiptPaymentTypeId: ' + req.params.receipt_payment_type_id);
			findReceiptPaymentType('SELECT * FROM receipt_payment_type WHERE receipt_payment_type_id = ?', [req.params.receipt_payment_type_id]).then(
				function (result) {

					let receiptPaymentTypeParams = [
						req.body.amount ? req.body.amount : result.amount,
						req.body.receipt_id ? req.body.receipt_id : result.receipt_id,
						req.body.payment_type_id ? req.body.payment_type_id : result.payment_type_id,
					];

					  // Active is set via a 'bit;
					  if (!req.body.active ? req.body.active : result.active) {
                        customerParams.push(0);
                    } else {
                        customerParams.push(1);
                    }
					
					receiptPaymentTypeParams.push(req.params.receipt_payment_type_id);
					const sqlUpdateReceiptPaymentType =
						'UPDATE receipt_payment_type ' +
						'SET amount = ?, receipt_id = ?, payment_type_id = ?, active = ? ' +
						'WHERE receipt_payment_type_id = ?';
					updateReceiptPaymentType(
						sqlUpdateReceiptPaymentType,
						receiptPaymentTypeParams,
						res
					);
				},
				function (reason) {
					res.status(404).send(
						'PUT ReceiptPaymentType: Could not find customer with receipt_payment_type_id ' +
						req.params.receipt_payment_type_id
					);
				}
			);
		}
	});
});

const updateReceiptPaymentType = (query, params, res) => {


	receipt_payment_type.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.UPDATE }).then(result => {
		if (Array.isArray(result) && result.length >= 1) {
			semaLog.info('updateReceiptPaymentType - succeeded');
			res.json(result);
		} else {
			res.json([]);
		}
	});


};

module.exports = router;
