const express = require('express');
const Sequelize = require('sequelize');
var format = require('date-fns/format');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const customer_reminders = require('../models').customer_reminders;


router.get('/:kiosk_id/:date', (req, res, next) => {
	semaLog.info('GET Customer Reminders - Enter');
	let kiosk_id = req.params.kiosk_id;
	let date = req.params.date;
	customer_reminders.findAll({
		where: {
			kiosk_id: kiosk_id,
			created_at: {
				gte: date
			},
		}
	}).then(customerReminders => {
		res.send(customerReminders);
	})
		.catch(function (err) {
			console.log("err", err);
			res.json({ error: err });
		});
});

router.post('/', function (req, res, next) {
	semaLog.info(req.body);
	semaLog.info('Reciept Customer Reminder Id - Enter');
	req.check('reminder_date', 'Parameter reminder_date is missing').exists();
	req.check('kiosk_id', 'Parameter kiosk_id is missing').exists();
	req.check('reminder_id', 'Parameter reminder_id is missing').exists();
	semaLog.info('body: ', req.body);
	req.getValidationResult().then(async function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error(
				'CREATE Customer Reminder: Validation error: ' + errors.toString()
			);
			res.status(400).send(errors.toString());
		} else {

			const cj = await findExistingReminderName(req.body.reminder_id, req.body.created_at);
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
				res.append('message', 'Customer Reminder has already been sent');
				res.sendStatus(400);
			}
		}
	})
});

router.put('/:reminder_id', async (req, res) => {
	semaLog.info('PUT customer_credit - Enter');
	req.check('reminder_id', 'Parameter reminder_id is missing').exists();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('PUT Customer Reminder, Validation error' + errors.toString());
			res.status(400).send(errors.toString());
		} else {
			semaLog.info('reminder_idId: ' + req.params.reminder_id);
			semaLog.info('body: ', req.body);
			delete req.body.id;
			update(req.body, req.params.reminder_id).then(result => {
				res.status(200).json(result);
			})
				.catch((err) => {
					console.log('err', err)
					res.status(400).json({ message: 'Invalid Assignment Error' });
				});
		}
	});
});

function findExistingReminderName(reminder_id, date) {
	return customer_reminders.findAll({
		where: {
			reminder_id,
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
	return customer_reminders.create(body).then(result => {
		return result;
	})
		.catch((err) => {
			console.log('err', err)
			return { message: 'Invalid Assignment Error' };
		});
}

function update(body, reminder_id) {
	console.log('body', body, reminder_id)
	return customer_reminders.update(body, { where: { reminder_id } }).then(result => {
		return result;
	})
		.catch((err) => {
			console.log('err', err)
			return { message: 'Invalid Assignment Error' };
		});
}

module.exports = router;
