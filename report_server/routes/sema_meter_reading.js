const express = require('express');
const Sequelize = require('sequelize');
var format = require('date-fns/format');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const meterReadingModal = require('../models').meter_reading;
const models = require('../models');

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
	req.getValidationResult().then(async function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error(
				'CREATE Meter Reading: Validation error: ' + errors.toString()
			);
			res.status(400).send(errors.toString());
		} else {

			const cj = await findByKioskIdAndWastageName(req.body.kiosk_id, req.body.created_at);
			if (cj.length === 0) {
				create({ ...req.body, active: 1 }).then(result => {
					res.status(200).json(result);
				})
					.catch((err) => {
						console.log('err', err);
						res.append('message', 'Contact Support Something not Right');
						res.sendStatus(400);
					})
			} else if (cj.length > 0) {
				res.append('message', 'Meter Reading has already been sent');
				res.sendStatus(400);
			}
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
			delete req.body.id;
			update(req.body, req.params.meter_reading_id).then(result => {
				res.status(200).json(result);
			})
				.catch((err) => {
					console.log('err', err)
					res.status(400).json({ message: 'Invalid Assignment Error' });
				});
		}
	});
});

function findByKioskIdAndWastageName(kiosk_id, date) {
	console.log(kiosk_id + " " + date)
	return meterReadingModal.findAll({
		where: {
			kiosk_id: kiosk_id,
		}
	}).then(result => {
		let ty = JSON.parse(JSON.stringify(result));
		const er = ty.filter(e => {
			if (format(new Date(date), 'yyyy-MM-dd') === format(new Date(e.created_at), 'yyyy-MM-dd')) {
				return { ...e }
			}
		})
		return er;
	})
}

function create(body) {
	return meterReadingModal.create(body).then(result => {
		return result;
	})
		.catch((err) => {
			console.log('err', err)
			return { message: 'Invalid Assignment Error' };
		});
}

function update(body, meter_reading_id) {
	return meterReadingModal.update(body, { where: { meter_reading_id } }).then(result => {
		return result;
	})
		.catch((err) => {
			console.log('err', err)
			return { message: 'Invalid Assignment Error' };
		});
}

module.exports = router;
