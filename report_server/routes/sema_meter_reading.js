const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const meterReadingModal = require('../models').meter_reading;

/* GET Meter Reading in the database. */
router.get('/:kiosk_id/:date', (req, res, next) => {
	semaLog.info('GET Meter Reading - Enter');
	let kiosk_id = req.params.kiosk_id;
	let date = req.params.date;
	meterReadingModal.findAll({
		where: {
			kiosk_id: kiosk_id,
			created_at: {
				gte: date
			},
		}
	}).then(meterReading => {
		res.send(meterReading);
	})
		.catch(function (err) {
			console.log("err", err);
			res.json({ error: err });
		});
});

router.post('/', function (req, res, next) {
	semaLog.info(req.body);
	semaLog.info('Reciept Meter reading Id - Enter');
	req.check('meter_value', 'Parameter meter_value is missing').exists();
	req.check('kiosk_id', 'Parameter kiosk_id is missing').exists();
	req.check('meter_reading_id', 'Parameter meter_reading_id is missing').exists();
	semaLog.info('body: ', req.body);
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
			meterReadingModal.create({ ...req.body, active: 1 }).then(result => {
				res.status(200).json(result);
			})
				.catch((err) => {
					console.log('err', err)
					res.status(400).json({ message: 'Invalid Assignment Error' });
				})
		}
	})
});


router.put('/:meter_reading_id', async (req, res) => {
	semaLog.info('PUT customer_credit - Enter');
	req.check('meter_reading_id', 'Parameter meter_reading_id is missing').exists();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('PUT Meter Reading, Validation error' + errors.toString());
			res.status(400).send(errors.toString());
		} else {
			semaLog.info('ReceiptPaymentTypeId: ' + req.params.meter_reading_id);
			semaLog.info('body: ', req.body);
			meterReadingModal.update(req.body, { where: { meter_reading_id: req.params.meter_reading_id } }).then(result => {
				res.status(200).json(result);
			})
				.catch((err) => {
					console.log('err', err)
					res.status(400).json({ message: 'Invalid Assignment Error' });
				});
		}
	});
});


module.exports = router;
