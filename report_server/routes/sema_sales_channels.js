const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const SalesChannel = require('../model_layer/SalesChannel');
const sales_channel = require('../models').sales_channel;


router.get('/:kiosk_id/:date', function (req, res) {
	semaLog.info('GET sales channels - Enter');
	__pool.getConnection((err, connection) => {
		if (err) {
			console.log("WTF: " + err);
			return;
		}
		connection.query('SELECT * FROM sales_channel', (err, result) => {
			connection.release();

			if (err) {
				semaLog.error('GET sales channels - failed', { err });
				res.status(500).send(err.message);
			} else {
				semaLog.info('GET sales channels - succeeded');
				res.json({ salesChannels: result.map((salesChannel) => { return (new SalesChannel(salesChannel)).classToPlain() }) });
			}
		});
	});
});


router.get('/:date', function (req, res) {
	semaLog.info('GET Credits - Enter');
	let date = req.params.date;

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('GET Credits validation error: ', errors);
			res.status(400).send(errors.toString());
		} else {

			sales_channel.findAll(
				{
					where: {
						created_at: {
							gte: date
						}
					}
				}).then(salesChannels => {
					res.status(200).json({ salesChannels });
				})
				.catch(function (err) {
					console.log("err", err);
					res.status(400).json({ error: err });
				});

		}
	});
});



module.exports = router;
