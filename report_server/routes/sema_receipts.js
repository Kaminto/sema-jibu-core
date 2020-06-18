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
const db = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validator = require('validator');
const moment = require('moment');

router.get('/:siteId', (req, res) => {
	let started = new Date();
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
			 					attributes: { exclude: 'base64encoded_image' }
			}]
			}]
	}).then(result => {
		res.send(result);
		console.log('took', (new Date().getTime() - started.getTime()), 'ms');
	});

	// }).then(result =>
	// 	res.send(result)
	// 	// console.log('took', (new Date().getTime() - started.getTime()), 'ms');
	// );
});

router.put('/:siteId', async (req, res) => {
	// Gather data sent
	return R.update({
		active: req.body.active,
		is_delete: req.body.is_delete,
	}, {
		where: {
			id: req.body.id
		}
	}).then(() => {
		return ReceiptLineItem.update({
			active: req.body.active
		}, {
			where: {
				receipt_id: req.body.id
			}
		}).then(() => {

			return res.status(200).json({ message: 'Update Successfull' });
		}).catch(() => {
			res.status(400).json({ message: 'Update failed on  reciept line update' });
		})
	}).catch(() => {
		return res.status(400).json({ message: 'Update failed on  reciept' });
	})
});

router.post('/', async (req, res) => {
	semaLog.info('CREATE RECEIPT sema_receipts- Enter');
	req.check("id", "id is missing").exists();
	req.check("currency_code", "currency_code is missing").exists();
	// req.check("customerId", "customerId is missing").exists();
	// req.check("created_at", "created_at is missing").exists();
	// req.check("siteId", "siteId is missing").exists();
	req.check("payment_type", "payment_type is missing").exists();
	req.check("sales_channel_id", "sales_channel_id is missing").exists();
	req.check("sales_channel_id", "sales_channel_id is missing").exists();
	req.check("total", "totalSales is missing").exists();
	req.check("cogs", "cogs is missing").exists();
	req.check("receiptId", "receiptId is missing").exists();
	req.check("products", "products is missing").exists();
	console.log('body', JSON.stringify(req.body));
	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			semaLog.error("Validation error: " + errors.toString());
			res.status(400).send(errors.toString());
		} else {
			const products = req.body["products"];

			if (products.length === 0) {
				return res.status(400).send({ msg: "Bad request, missing Order Items." });
			}

			for (let i = 0; i < products.length; i++) {
				if (!products[i].productId || !products[i].quantity || !products[i].priceTotal || !products[i].cogsTotal) {
					semaLog.error("CREATE RECEIPT - Bad request, missing parts of product");
					return res.status(400).send({ msg: "Bad request, missing parts of receipt.product." });
				}
			}

		//	db.sequelize.transaction(transaction => {
				return R.create({ ...req.body, active: 1 }).then(result => {

					var orderItems = [];
					for (let i = 0; i < req.body.products.length; i++) {
						orderItems.push({
							created_at: req.body.products[i].created_at,
							updated_at: req.body.products[i].updated_at,
							currency_code: req.body.currency_code,
							price_total: req.body.products[i].priceTotal,
							quantity: req.body.products[i].quantity,
							receipt_id: req.body.receiptId,
							product_id: req.body.products[i].productId,
							cogs_total: req.body.products[i].cogsTotal,
							active: 1,
							notes: req.body.products[i].notes,
							empties_returned: req.body.products[i].emptiesReturned,
							damaged_bottles: req.body.products[i].damagedBottles ? req.body.products[i].damagedBottles : 0,
							pending_bottles: req.body.products[i].pendingBottles
						})
					}


					ReceiptLineItem.bulkCreate(orderItems).then(result => {
						res.status(200).json(result);
					})
						.catch((err) =>{
							console.log('err', err);
							res.status(400).json({ message: 'Invalid Assignment Error' });
						})

				})
					.catch((err)=> {
						console.log('err2', err);
						res.status(400).json({ message: 'Invalid Assignment Error' });
					})

			//})

		}
	});
});

module.exports = router;
