const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const bodyParser = require('body-parser');
const Product = require('../model_layer/Product');

const list = require('./products/list');
const list_user = require('./users/list');
const list_franchise = require('./kiosk/list');
const post = require('./products/post');
const update = require('./products/update');
const findById = require('./products/find-by-id');


router.get('/', async (req, res, next) => {
    semaLog.info('GET kiosks - Enter');
    console.log(req.query);
    //list_user.listNoQuery
    //list_franchise.listAllDropDown
    return Promise.all(
        [list_user.listNoQuery(),
        list.listAllProducts(),
        list_franchise.listAllDropDown()]
    ).then(values => {
        return res.json({
            users: values[0].total,
            products: values[1].total,
            franchises: values[2].total
        });
    })

    // list.listAllProducts().then(({ data, total }) => {
    // 	return res.json({  total });
    // })
    // 	.catch(next);
});


function handleError(res, statusCode, message) {
    return (error) => {
        return res.status(statusCode).json({ message: message || error.message });
    };
}


module.exports = router;
