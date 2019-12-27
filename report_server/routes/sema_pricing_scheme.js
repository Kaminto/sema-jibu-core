const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const pricing_scheme=require('../models').pricing_scheme;

/* GET Pricing Schemes in the database. */
router.get('/', function(req, res) {
	semaLog.info('Pricing Schemes - Enter');
	pricing_scheme.findAll().then(receiptPaymentType=>{
		res.send(receiptPaymentType)
	});
});

router.post('/', function (req, res, next) {
    semaLog.info(req.body);
    req.check('region_id', 'Parameter region_id is missing').exists();
    req.check('kiosk_id', 'Parameter kiosk_id is missing').exists();
	req.check('description', 'Parameter description is missing').exists();
    req.check('name', 'Parameter name is missing').exists();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            const errors = result.array().map(elem => {
                return elem.msg;
            });
            semaLog.error(
                'CREATE pricing_scheme: Validation error: ' + errors.toString()
            );
            res.status(400).send(errors.toString());
        } else {

            pricing_scheme.create(req.body).then(promotion => {
                res.status(200).json(promotion);
            })
                .catch(Sequelize.ForeignKeyConstraintError, function handleError() {
                    res.status(400).json({ message: 'Invalid Assignment Error' });
                })
                .catch(next);
        }
    })


});


module.exports = router;
