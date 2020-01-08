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

router.get('/:receipt_id', function (req, res) {
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

router.post('/', function (req, res, next) {
	semaLog.info(req.body);
	semaLog.info('Reciept Payment Type - Enter');
	req.check('receipt_id', 'Parameter receipt_id is missing').exists();
	req.check('payment_type_id', 'Parameter payment_type_id is missing').exists();
	req.check('amount', 'Parameter amount is missing').exists();


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

			receipt_payment_type.create(req.body).then(result => {
				res.status(200).json(result);
			})
				.catch(Sequelize.ForeignKeyConstraintError, function handleError() {
					res.status(400).json({ message: 'Invalid Assignment Error' });
				})
				.catch(next);

		}
	})

});

module.exports = router;
