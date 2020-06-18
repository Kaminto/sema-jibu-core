const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const CustomerType = require('../model_layer/CustomerType');
const customer_type = require('../models').customer_type;
router.get('/:h/:g', function(req, res) {
	semaLog.info('GET customer types - Enter');
	__pool.getConnection((err, connection) => {
		if (err) {
			console.log("WTF: "+ err);
			return ;
		}
		//connection.query('SELECT * FROM customer_type', (err, result ) => {
		connection.query('select c.id, c.name, c.description, sales_channel_id, s.name as sales_channel_name from customer_type c left join sales_channel s on c.sales_channel_id=s.id', (err, result ) => {
			connection.release();

			if (err) {
				semaLog.error( 'GET customer types  - failed', {err});
				res.status(500).send(err.message);
			} else {
				semaLog.info( 'GET customer types  - succeeded');
				res.json({ customerTypes: result.map( (customerType) => { return (new CustomerType(customerType)).classToPlain()}) });
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

			customer_type.findAll(
				{
					where: {
						created_at: {
							gte: date
						}
					}
				}).then(customerTypes => {
					res.status(200).json({ customerTypes });
				})
				.catch(function (err) {
					console.log("err", err);
					res.status(400).json({ error: err });
				});

		}
	});
});

module.exports = router;
