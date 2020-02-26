const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const meterReadingModal = require('../models').meter_reading;

/* GET Meter Reading in the database. */
router.get('/:kiosk_id', (req, res) => {
	semaLog.info('GET Meter Reading - Enter');
	let kiosk_id = req.params.kiosk_id;
	meterReadingModal.findAndCountAll({
		where: {
			kiosk_id: kiosk_id,
		},
	}).then(result => res.status(200).json({ data: result, total: count }));
});

router.post('/', function (req, res, next) {
	semaLog.info(req.body);
	semaLog.info('Reciept Meter reading Id - Enter');
	req.check('meter_value', 'Parameter meter_value is missing').exists();
	req.check('kiosk_id', 'Parameter kiosk_id is missing').exists();
	req.check('meter_reading_id', 'Parameter meter_reading_id is missing').exists();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error(
				'CREATE Meter Reading: Validation error: ' + errors.toString()
			);
			res.status(400).send(errors.toString());
		} else {
			receipt_payment_type.create({ ...req.body, active: 1 }).then(result => {
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
