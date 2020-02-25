const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const ReminderModal = require('../models').reminders;

const sqlDeleteReminder = 'DELETE FROM reminders WHERE reminderId = ?';
const sqlGetReminderById = 'SELECT * FROM reminders WHERE reminderId = ?';

const sqlInsertReminder =
	'INSERT INTO reminders ' +
	'(reminderId, created_at, customer_account_id, frequency, show_reminders, reminder_date, kiosk_id, active ) ' +
	'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

router.put('/:reminderId', async (req, res) => {
	semaLog.info('PUT reminders - Enter');
	req.check('reminderId', 'Parameter reminderId is missing').exists();
	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('PUT customer, Validation error' + errors.toString());
			res.status(400).send(errors.toString());
		} else {
			semaLog.info('ReminderId: ' + req.params.reminderId);
			findReminder(sqlGetReminderById, [req.params.reminderId]).then(
				function (result) {
					// Active is set via a 'bit;
					let active = 0;
					if (!req.body.active ? req.body.active : result.active) {
						active = 0;
					} else {
						active = 1;
					}

					ReminderModal.update({
						due_amount: req.body.due_amount ? req.body.due_amount : result.due_amount,
						frequency: req.body.frequency,
						show_reminders: req.body.show_reminders,
						reminder_date: req.body.reminder_date,
						kiosk_id: req.body.kiosk_id,
						active
					},
						{ where: { reminderId: req.params.reminderId } }
					).then(result => {
						if (Array.isArray(result) && result.length >= 1) {
							semaLog.info('updateReminder - succeeded');
							res.json(result);
						} else {
							res.json([]);
						}
					});
				},
				function (reason) {
					res.status(404).send(
						'PUT customer DEBT: Could not find customer debt with id ' +
						req.params.reminderId
					);
				}
			);
		}
	});
});

router.delete('/:reminderId', async (req, res) => {
	semaLog.info('DELETE sema_customer - Enter');

	semaLog.info(req.params.reminderId);

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('Delete customer. Validation error');
			res.status(400).send(errors.toString());
		} else {
			findReminder(sqlGetReminderById, [req.params.reminderId]).then(
				function (result) {
					console.log(result);
					semaLog.info('result - Enter', result);

					deleteReminder(sqlDeleteReminder, [req.params.reminderId], res);
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

const findReminder = (query, params) => {
	return new Promise((resolve, reject) => {

		ReminderModal.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.SELECT }).then(result => {
			if (Array.isArray(result) && result.length >= 1) {
				resolve(result);
			} else {
				resolve([]);
			}
		});

	});
};

const deleteReminder = (query, params, res) => {

	ReminderModal.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.DELETE }).then(result => {
		if (Array.isArray(result) && result.length >= 1) {
			res.json({ topup: result });
		} else {
			res.json([]);
		}
	}).catch(error => {
		console.log(error);
		res.status(500).send('Reminder Delete - failed');
	});

};

router.post('/', async (req, res) => {
	semaLog.info('CREATE sema_customer - Enter');

	//var postSqlParams = [];

	semaLog.info(req.body);
	req.check('reminderId', 'Parameter reminderId is missing').exists();
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


			let postSqlParams = [
				req.body.reminderId,
				getUTCDate(new Date()),
				req.body.customer_account_id,
				req.body.frequency,
				req.body.show_reminders,
				req.body.reminder_date,
				req.body.kiosk_id,
				1,
			];
			insertReminder(sqlInsertReminder, postSqlParams, res);
		}
	});
});

const insertReminder = (query, params, res) => {
	ReminderModal.sequelize.query(query, { replacements: params, type: Sequelize.QueryTypes.INSERT }).then(result => {
		if (Array.isArray(result) && result.length >= 1) {
			res.json(result);
		} else {
			res.json([]);
		}
	}).catch(function (error) {
		semaLog.error('Reminder - failed', { error });
		res.status(500).send('Reminder - failed');
	});

};

router.get('/:kiosk_id', (req, res) => {
	semaLog.info('GET Reminders - Enter');
	let kiosk_id = req.params.kiosk_id;
	ReminderModal.findAll({
		where: {
			kiosk_id: kiosk_id,
		},
	}).then(result => res.send(result));
});


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
