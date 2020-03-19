const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const Kiosk = require('../model_layer/Kiosk');

const list = require('./kiosk/list');
const findById = require('./kiosk/find-by-id');

/* GET kiosks in the database. */
router.get('/', function(req, res) {
	semaLog.info('kiosks - Enter');
	__pool.getConnection((err, connection) => {
		if (err) {
			console.log("WTF: "+ err);
			return ;
		}
		connection.query('SELECT * FROM kiosk WHERE active = 1', (err, result ) => {
			connection.release();

			if (err) {
				semaLog.error( 'kiosks - failed', {err});
				res.status(500).send(err.message);
			} else {
				semaLog.info( 'kiosks - succeeded');
				res.json({ kiosks: result.map( (kiosk) => { return (new Kiosk(kiosk)).classToPlain()}) });
			}
		});
	});
});

router.get('/admin', async (req, res, next) => {
	semaLog.info('GET kiosks - Enter');
	list.listAll(req.query).then(({ data, total }) => {
		return res.json({ data, total });
	})
		.catch(next);
});

router.get('/admin/all', async (req, res, next) => {
	semaLog.info('GET kiosks - Enter');
	list.listAllDropDown(req.query).then(({ data, total }) => {
		return res.json({ data, total });
	})
		.catch(next);
});

router.get('/admin/:id', async (req, res, next) => {
	semaLog.info('GET kiosk - Enter');
	const id = parseInt(req.params.id);
	return findById.findByPk(id)
		.then(data => res.status(200).json({ data }))
		.catch(Sequelize.EmptyResultError, handleError(res, 404))
		.catch(next);
});

function handleError(res, statusCode, message) {
    return (error) => {
        return res.status(statusCode).json({ message: message || error.message });
    };
}

module.exports = router;
