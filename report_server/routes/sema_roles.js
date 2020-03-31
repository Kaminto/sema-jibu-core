const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');

const list = require('./roles/list');
const findById = require('./roles/find-by-id');

router.get('/admin', async (req, res, next) => {
    semaLog.info('GET roles - Enter');
    list.listAll(req.query).then(({ data, total }) => {
        return res.json({ data, total });
    })
        .catch(next);
});

router.get('/admin/all', async (req, res, next) => {
    semaLog.info('GET roles - Enter');
    list.listAllDropDown(req.query).then(({ data, total }) => {
        return res.json({ data, total });
    })
        .catch(next);
});

router.get('/admin/:id', async (req, res, next) => {
    semaLog.info('GET role - Enter');
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
