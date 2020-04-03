const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const semaLog = require('../seama_services/sema_logger');
const Customer = require('../model_layer/Customer');
const customerModal = require('../models').customer_account;
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
  

const sqlSiteIdOnly =
	'SELECT * ' +
	'FROM customer_account ' +
	"WHERE kiosk_id = ? AND active = b'1'" +
	' ORDER BY name ASC';
const sqlBeginDateOnly =
	'SELECT * ' +
	'FROM customer_account ' +
	"WHERE kiosk_id = ? AND active = b'1'" +
	'AND created_at >= ? ' +
	' ORDER BY name ASC';
const sqlEndDateOnly =
	'SELECT * ' +
	'FROM customer_account ' +
	"WHERE kiosk_id = ? AND active = b'1'" +
	'AND created_at <= ?' +
	' ORDER BY name ASC';
const sqlBeginEndDate =
	'SELECT * ' +
	'FROM customer_account ' +
	"WHERE kiosk_id = ? AND active = b'1'" +
	'AND created_at BETWEEN ? AND ?' +
	' ORDER BY name ASC ';
const sqlUpdatedDate =
	'SELECT * ' +
	'FROM customer_account ' +
	'WHERE kiosk_id = ? ' +
	'AND updated_at > ? ' +
	' ORDER BY name ASC';


const sqlDeleteCustomers = 'DELETE FROM customer_account WHERE id = ?';
const sqlGetCustomerById = 'SELECT * FROM customer_account WHERE id = ?';

const sqlInsertCustomer =
	'INSERT INTO customer_account ' +
	'(id, created_at, name, customer_type_id, sales_channel_id, kiosk_id, ' +
	'due_amount, address_line1, gps_coordinates, phone_number, active, second_phone_number ) ' +
	'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';



router.put('/:id', function (req, res, next) {
	semaLog.info(req.body);
	semaLog.info('Customer Update - Enter');
	req.check('phoneNumber', 'Parameter phoneNumber is missing').exists();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error(
				'Update Customer: Validation error: ' + errors.toString()
			);
			res.status(400).send(errors.toString());
		} else {
			
			customerModal.update({ 
				name: req.body.name,
				sales_channel_id: req.body.salesChannelId,
				customer_type_id: req.body.customerTypeId,
				due_amount: req.body.dueAmount,
				wallet_balance: req.body.walletBalance,
				address_line1: req.body.address,
				gps_coordinates: req.body.gpsCoordinates,
				updated_at: req.body.gpsCoordinates,
				phone_number: req.body.phoneNumber,
				second_phone_number: req.body.secondPhoneNumber,
				frequency:req.body.frequency,
				updated_at:req.body.updatedDate,
				active: req.body.active ? 1 : 0,
				is_delete: req.body.is_delete,
			
			}, { where: { id: req.params.id } }).then(result => {
				res.status(200).json(result);
			})
				.catch(Sequelize.ForeignKeyConstraintError, function handleError() {
					res.status(400).json({ message: 'Invalid Assignment Error' });
				})
				.catch(next);

		}
	})

});
 

router.delete('/:id', async (req, res) => {
	semaLog.info('DELETE sema_customer - Enter');

	semaLog.info(req.params.id);

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('Delete customer. Validation error');
			res.status(400).send(errors.toString());
		} else {
			findCustomers(sqlGetCustomerById, req.params.id).then(
				function (result) {
					deleteCustomers(sqlDeleteCustomers, req.params.id, res);
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

const findCustomers = (query, params) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, params, function (err, result) {
				connection.release();
				if (err) {
					semaLog.error('customers - failed', { err });
					res.status(500).send(err.message);
					reject(err);
				} else {
					semaLog.info('customers - succeeded');

					try {
						if (Array.isArray(result) && result.length > 0) {
							resolve(result);
						} else {
							reject(null);
						}
					} catch (err) {
						semaLog.error('customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}
				}
			});
		});
	});
};

const deleteCustomers = (query, params, res) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, params, function (err, result) {
				connection.release();
				if (err) {
					semaLog.error('customers - failed', { err });
					res.status(500).send(err.message);
					reject(err);
				} else {
					semaLog.info(' deleteCustomers customers - succeeded');

					try {
						let msg =
							'Deleted customer with Id ' + params.toString();
						resolve(res.status(200).send(msg));
					} catch (err) {
						semaLog.error('customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}
				}
			});
		});
	});
};

router.post('/', async (req, res) => {
	semaLog.info('CREATE sema_customer - Enter');

	//var postSqlParams = [];

	semaLog.info(req.body);
	req.check('customerTypeId', 'Parameter customerTypeId is missing').exists();
	req.check('salesChannelId', 'Parameter salesChannelId is missing').exists();
	req.check('name', 'Parameter name is missing').exists();
	req.check('siteId', 'Parameter siteId is missing').exists();
	req.check('address', 'Parameter address is missing').exists();
	req.check('phoneNumber', 'Parameter phoneNumber is missing').exists();

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
			let customer = new Customer();
			customer.requestToClass(req);

			let postSqlParams = [
				customer.customerId,
				getUTCDate(customer.createdDate),
				customer.name,
				customer.customerTypeId,
				customer.salesChannelId,
				customer.siteId,
				customer.dueAmount,
				customer.address,
				customer.gpsCoordinates,
				customer.phoneNumber,
				1,
				customer.secondPhoneNumber
			];

			insertCustomers(customer, sqlInsertCustomer, postSqlParams, res);
		}
	});
});

const insertCustomers = (customer, query, params, res) => {
	__pool.getConnection((err, connection) => {
		connection.query(query, params, function (err, result) {
			connection.release();
			if (err) {
				semaLog.error('customers - failed', { err });
				res.status(500).send(err.message);
			} else {
				semaLog.info('CREATE customer - succeeded');

				try {
					res.json(customer.classToPlain());
				} catch (err) {
					semaLog.error('customers - failed', { err });
					res.status(500).send(err.message);
				}
			}
		});
	});
};

router.get('/', function (req, res) {
	semaLog.info('GET Customers - Enter');

	req.check('site-id', 'Parameter site-id is missing').exists();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map(elem => {
				return elem.msg;
			});
			semaLog.error('GET Customers validation error: ', errors);
			res.status(400).send(errors.toString());
		} else {
			semaLog.info('Site-id: ' + req.query['site-id']);
			if (req.query.hasOwnProperty('updated-date')) {
				let updatedDate = getUTCDate(
					new Date(req.query['updated-date'])
				);

				if (!isNaN(updatedDate)) {
					getCustomers(
						sqlUpdatedDate,
						[req.query['site-id'], updatedDate],
						res
					);
				} else {
					semaLog.error('GET Customers - Invalid updatedDate');
					res.status(400).send('Invalid Date');
				}
			} else if (
				req.query.hasOwnProperty('begin-date') &&
				req.query.hasOwnProperty('end-date')
			) {
				let beginDate = getUTCDate(new Date(req.query['begin-date']));
				let endDate = getUTCDate(new Date(req.query['end-date']));
				if (!isNaN(beginDate) && !isNaN(endDate)) {
					getCustomers(
						sqlBeginEndDate,
						[req.query['site-id'], beginDate, endDate],
						res
					);
				} else {
					semaLog.error(
						'GET Customers - Invalid begin-date/end-date'
					);
					res.status(400).send('Invalid Date');
				}
			} else if (req.query.hasOwnProperty('begin-date')) {
				let beginDate = getUTCDate(new Date(req.query['begin-date']));
				semaLog.info(
					'GET Customers - beginDate: ' + beginDate.toISOString()
				);
				if (!isNaN(beginDate)) {
					getCustomers(
						sqlBeginDateOnly,
						[req.query['site-id'], beginDate],
						res
					);
				} else {
					semaLog.error('GET Customers - Invalid begin-date');
					res.status(400).send('Invalid Date');
				}
			} else if (req.query.hasOwnProperty('end-date')) {
				let endDate = getUTCDate(new Date(req.query['end-date']));
				if (!isNaN(endDate)) {
					getCustomers(
						sqlEndDateOnly,
						[req.query['site-id'], endDate],
						res
					);
				} else {
					semaLog.error('GET Customers - Invalid end-date');
					res.status(400).send('Invalid Date');
				}
			} else {
				getCustomers(sqlSiteIdOnly, [req.query['site-id']], res);
			}
		}
	});
});

router.get('/:kiosk_id/:date', function (req, res) {
	semaLog.info('Get Customers - Enter');
	let kiosk_id = req.params.kiosk_id;
	customerModal.findAll({
		where: {
			kiosk_id: kiosk_id,
			created_at: {
				gte: req.params.date
			},
		},
	}).then(result => {
		semaLog.info('GET Customers - success');
		res.json({customers: result});
	}).catch(function (err) {
		semaLog.error('GET Customers - failed', { err });
		res.json({ error: err });
	});
});

const getCustomers = (query, params, res) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, params, function (err, result) {
				connection.release();

				if (err) {
					semaLog.error('GET Customers - failed', { err });
					res.status(500).send(err.message);
					reject(err);
				} else {
					semaLog.info('GET Customers - succeeded');
					try {
						console.log(result);
						if (Array.isArray(result) && result.length >= 1) {
							var values = result.map(item => {
								customer = new Customer();
								customer.databaseToClass(item);
								return customer.classToPlain(item);
							});

							resolve(res.json({ customers: values }));
						} else {
							resolve(res.json({ customers: [] }));
						}
					} catch (err) {
						semaLog.error('GET Customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}
				}
			});
		});
	});
};

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
