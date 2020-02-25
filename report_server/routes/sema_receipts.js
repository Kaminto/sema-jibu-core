const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const bodyParser = require('body-parser');
const Receipt = require('../model_layer/Receipt');
const R = require(`${__basedir}/models`).receipt;
const CustomerAccount = require(`${__basedir}/models`).customer_account;
const ReceiptLineItem = require(`${__basedir}/models`).receipt_line_item;
const receipt_payment_type = require(`${__basedir}/models`).receipt_payment_type;
const payment_type = require('../models').payment_type;
const Product = require(`${__basedir}/models`).product;
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const validator = require('validator');
const moment = require('moment');

var sqlInsertReceipt = "INSERT INTO receipt " +
	"(id, created_at, updated_at, currency_code, " +
	"customer_account_id, amount_cash, amount_mobile, amount_loan,amount_bank,amount_cheque,amountjibuCredit, amount_card, isWalkIn, " +
	"kiosk_id, payment_type, sales_channel_id, customer_type_id, total, cogs, uuid, delivery, is_delete )" +
	"VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? )";

var sqlInsertReceiptActive = "INSERT INTO receipt " +
	"(id, created_at, updated_at, currency_code, " +
	"customer_account_id, amount_cash, amount_mobile, amount_loan,amount_bank,amount_cheque,amountjibuCredit, amount_card, isWalkIn, " +
	"kiosk_id, payment_type, sales_channel_id, customer_type_id, total, cogs, uuid, delivery, is_delete, active)" +
	"VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?)";

var sqlInsertReceiptLineItem = "INSERT INTO receipt_line_item " +
	"(created_at, updated_at, currency_code, price_total, quantity, receipt_id, product_id, cogs_total,notes, empties_returned, damaged_bottles, pending_bottles) " +
	"VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?)";

var sqlInsertReceiptLineItemActive = "INSERT INTO receipt_line_item " +
	"(created_at, updated_at, currency_code, price_total, quantity, receipt_id, product_id, cogs_total, active,notes, empties_returned, damaged_bottles, pending_bottles) " +
	"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?)";

// Returns all receipts for the site and the date passed, except for those in `exceptionList`
const getReceipts = (siteId, exceptionList, date) => {
	R.belongsTo(CustomerAccount);
	R.hasMany(ReceiptLineItem);
	R.hasMany(receipt_payment_type);
	ReceiptLineItem.belongsTo(Product);
	receipt_payment_type.belongsTo(payment_type);
	return new Promise(async (resolve, reject) => {
		const [err, receipts] = await __hp(R.findAll({
			where: {
				kiosk_id: siteId,
				created_at: {
					gte: date
				},
				id: {
					notIn: exceptionList
				}
			},
			include: [
				{
					model: CustomerAccount
				},
				{
					model: ReceiptLineItem,
					include: [{
						model: Product,
						// we don't want the product image, too heavy. We'll take care of it client-side
// 						attributes: { exclude: 'base64encoded_image' }
					}]
				},
				{
					model: receipt_payment_type,
					include: [{
						model: payment_type,
					}]
				}
			]
		}));

		if (err) {
			return reject(err);
		}

		resolve(receipts);
	});
};

router.get('/:siteId', (req, res) => {
	R.belongsTo(CustomerAccount);
	R.hasMany(ReceiptLineItem);
	ReceiptLineItem.belongsTo(Product);

	let id = req.params.siteId;
	let date = req.query.date;
	R.findAll({
		where: {
			kiosk_id: id,
			created_at: {
				gte: date
			},
		},
		include: [
			{
				model: CustomerAccount
			},
			{
				model: ReceiptLineItem,
				include: [{
					model: Product,
// 					attributes: { exclude: 'base64encoded_image' }
				}]
			}]
	}).then(result => res.send(result));
});

router.put('/:siteId', async (req, res) => {
	// Gather data sent
	const {
		receipts,
		exceptionList
	} = req.body;
	const {
		date
	} = req.query;
	const { siteId } = req.params;

	console.log(`Client has ${exceptionList.length}.`);

	let updatePromises = receipts.filter(receipt => receipt.updated).map(receipt => {
		return R.update({
			active: receipt.active
		}, {
			where: {
				id: receipt.id
			}
		}).then(() => {
			return ReceiptLineItem.update({
				active: receipt.active
			}, {
				where: {
					receipt_id: receipt.id
				}
			})
		})
	});

	await Promise.all(updatePromises);

	const [err, newReceipts] = await __hp(getReceipts(siteId, exceptionList, date));

	// On error, return a generic error message and log the error
	if (err) {
		semaLog.warn(`sema_receipts - Fetch - Error: ${JSON.stringify(err)}`);
		return res.status(500).json({ msg: "Internal Server Error" });
	}

	console.log(`Server sending ${newReceipts.length} extra receipts to client.`);

	// On success, return a success message containing the data
	return res.json({ newReceipts });
});


router.post('/', async (req, res) => {
	semaLog.info('CREATE RECEIPT sema_receipts- Enter');
	req.check("id", "id is missing").exists();
	req.check("currencyCode", "currencyCode is missing").exists();
	req.check("customerId", "customerId is missing").exists();
	req.check("createdDate", "createdDate is missing").exists();
	req.check("siteId", "siteId is missing").exists();
	req.check("paymentType", "paymentType is missing").exists();
	req.check("salesChannelId", "salesChannelId is missing").exists();
	req.check("customerTypeId", "customerTypeId is missing").exists();
	req.check("total", "totalSales is missing").exists();
	req.check("cogs", "cogs is missing").exists();
	req.check("receiptId", "receiptId is missing").exists();
	req.check("products", "products is missing").exists();

	console.log(JSON.stringify(req.body));

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			semaLog.error("Validation error: " + errors.toString());
			res.status(400).send(errors.toString());
		} else {
			const products = req.body["products"];

			for (let i = 0; i < products.length; i++) {
				console.log(products[i].productId + " " + products[i].quantity + " " + products[i].priceTotal + " " + products[i].cogsTotal)
				if (!products[i].productId || !products[i].quantity || !products[i].priceTotal || !products[i].cogsTotal) {
					semaLog.error("CREATE RECEIPT - Bad request, missing parts of product");
					return res.status(400).send({ msg: "Bad request, missing parts of receipt.product." });
				}
			}

			try {
				//let receipt = new Receipt(req.body);
				let postSqlParams = [
					req.body.id,
					new Date(req.body.createdDate),
					req.body.updatedDate, req.body.currencyCode,
					req.body.customerId, req.body.amountCash, req.body.amountMobile,
					req.body.amountLoan, req.body.amount_bank, req.body.amount_cheque,
					req.body.amountjibuCredit, req.body.amountCard, req.body.isWalkIn,
					req.body.siteId, req.body.paymentType, req.body.salesChannelId,
					req.body.customerTypeId,
					req.body.total, req.body.cogs,
					req.body.receiptId, req.body.delivery, req.body.is_delete];

				if ('active' in req.body) {
					postSqlParams.push(req.body.active);
				}

				insertReceipt(req.body, 'active' in req.body ? sqlInsertReceiptActive : sqlInsertReceipt, postSqlParams, res);
			} catch (err) {
				semaLog.warn(`sema_receipts - Error: ${err}`);
				return res.status(500).send({ msg: "Internal Server Error" });
			}
		}
	});

});

const insertReceipt = (receipt, query, params, res) => {
	__pool.getConnection((err, connection) => {
		connection.beginTransaction(function (err) {
			connection.query(query, params, function (err, result) {
				if (err) {
					semaLog.error('insertReceipt- receipts - failed(1)', { err });
					connection.rollback();

					// Use http 'conflict if this is a duplicate
					res.status(err.code === "ER_DUP_ENTRY" ? 409 : 500).send(err.message);
					connection.release();
				}
				else {
					semaLog.info('receipts - succeeded');
					if (receipt.products.length === 0) {
						commitTransaction(receipt, connection, res);
					} else {
						let receiptId = result.insertId;
						let successCount = 0;
						let resolveCount = 0;
						for (let i = 0; i < receipt.products.length; i++) {
							let sqlProductParams = [
								new Date(receipt.products[i].createdDate),
								receipt.products[i].updatedDate,
								receipt.currencyCode,
								receipt.products[i].priceTotal,
								receipt.products[i].quantity,
								receipt.products[i].receiptId,
								receipt.products[i].productId,
								receipt.products[i].cogsTotal,
								receipt.products[i].active,
								receipt.products[i].notes,
								receipt.products[i].emptiesReturned,
								receipt.products[i].damagedBottles,
								receipt.products[i].pendingBottles

							];

							if ('active' in receipt.products[i]) {
								sqlProductParams.push(receipt.products[i].active)
							}

							semaLog.info("Inserting line item #" + i);
							insertReceiptLineItem('active' in receipt.products[i] ?
								sqlInsertReceiptLineItemActive :
								sqlInsertReceiptLineItem, sqlProductParams, connection).then(function (result) {
									semaLog.info("Inserted line item #" + resolveCount);
									resolveCount++;
									if (result) {
										successCount++;
									}

									if (resolveCount == receipt.products.length) {
										if (successCount == resolveCount) {
											commitTransaction(receipt, connection, res);
										} else {
											connection.rollback(function () {
												semaLog.error('insertReceipt- receipts - failed(2)', { err });
												res.status(500).send("Error");
												connection.release();
											});
										}
									}
								})
						}
					}
				}
			});
		});
	});
};

const commitTransaction = (receipt, connection, res) => {
	connection.commit(function (err) {
		if (err) {
			connection.rollback(function () {
				semaLog.error('CommitTransaction- Create receipt - failed', { err });
				res.status(500).send(err.message);
				connection.release();

			});
		} else {
			connection.release();

		}
		try {
			res.json(receipt.classToPlain());
		} catch (err) {
			semaLog.error('CommitTransaction- receipts - failed', { err });
			res.status(500).send(err.message);
		}
		semaLog.info('Receipt Transaction Complete.');

	})
}

const insertReceiptLineItem = (query, params, connection) => {
	return new Promise((resolve, reject) => {
		connection.query(query, params, function (err, result) {
			if (err) {
				semaLog.error('insertReceiptLineItem - Failed, err: ' + err.message);
				resolve(false);
			}
			else {
				semaLog.info('insertReceiptLineItem - succeeded');
				resolve(true);
			}
		});

	});
};

module.exports = router;
