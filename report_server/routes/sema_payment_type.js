const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const payment_type = require('../models').payment_type;

/* GET Payment Type Credit in the database. */
router.get('/', function (req, res) {
	semaLog.info('Payment Type - Enter');
	payment_type.findAll().then(paymentType => {
		res.send(paymentType)
	});
});


router.post('/', function (req, res, next) {
    semaLog.info(req.body);
    req.check('name', 'Parameter name is missing').exists();
    req.check('description', 'Parameter description is missing').exists();


    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error(
                'CREATE Payment Type: Validation error: ' + errors.toString()
            );
            res.status(400).send(errors.toString());
        } else {

            payment_type.create(req.body).then(result => {
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
