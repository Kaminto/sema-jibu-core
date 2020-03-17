const express = require('express');
const Sequelize = require('sequelize');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const router = express.Router();
const _ = require('lodash');
const Op = Sequelize.Op;
const db = require('../models');

const list = require('./users/list');
const findById = require('./users/find-by-id');

router.get('/', async (req, res) => {
	semaLog.info('GET users - Enter');

	try {
		let users = await db.user.findAll();
		let userData = await Promise.all(
			users.map(async user => await user.toJSON())
		);
		res.json({ users: userData });
	} catch (err) {
		semaLog.error(`GET users failed - ${err}`);
		res.status(400).json({
			message: `Failed to GET users ${err}`,
			err: `${err}`
		});
	}
});

router.post('/', async (req, res) => {
	semaLog.info('create user - enter');
	const {
		username,
		email,
		password,
		firstName,
		lastName,
		role
	} = req.body;
	let assignedRoles;
	try {
		const user = await db.user.findOne({
			where: { [Op.or]: [{ email: email }, { username: username }] }
		});
		if (user) {
			semaLog.info('Email/username already exists');
			throw new Error('User already exists');
		}

		const createdUser = await db.user.create({
			username,
			email,
			password,
			first_name: firstName,
			last_name: lastName,
			active: true
		});
		semaLog.info('User created success');

		const dbRoles = await db.role.findAll({ where: { code: role } });
		await Promise.all(dbRoles.map(async r => await r.addUser(createdUser)));

		res.json({
			message: 'create user success',
			user: await createdUser.toJSON()
		});
	} catch (err) {
		semaLog.error(`Create user failed - ${err}`);
		res.status(400).json({
			message: `Failed to create user ${err}`,
			err: `${err}`
		});
	}
});

router.put('/:id', async (req, res) => {
	semaLog.info(`UPDATE user ${req.params.id} - enter`);
	const {
		username,
		email,
		password,
		firstName,
		lastName,
		role
	} = req.body.data;
	let userData = {
		username,
		email,
		first_name: firstName,
		last_name: lastName
	};

	if (password) {
		userData = Object.assign(userData, { password });
	}

	try {
		const user = await db.user.findOne({ where: { id: req.params.id } });
		if (!user) {
			throw new Error('User not found');
		}

		let updatedUser = await user.update(userData);
		await updatedUser.setRoles([]); // clear roles
		if (role) {
			const dbRoles = await db.role.findAll({ where: { code: role } });
			await Promise.all(
				dbRoles.map(async r => await r.addUser(updatedUser))
			);
		}
		res.json({
			message: 'Update user success',
			user: await updatedUser.toJSON()
		});
	} catch (err) {
		semaLog.error(`Update user failed - ${err}`);
		res.status(400).json({
			message: `Update user failed - ${err}`,
			err: `${err}`
		});
	}
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;
	semaLog.info(`Enter delete user ${id}`);

	try {
		let user = await db.user.findOne({ where: { id } });
		let role = await user.getRoles();
		if (!user) throw new Error('User not found');
		if (user.active) throw new Error('User must be deactivated');
		if (role.length) throw new Error('User must not have any role(s)');

		await user.destroy();
		semaLog.info('User successfully deleted');
		res.json({
			message: `User ${id} successfully deleted`,
			id
		});
	} catch (err) {
		const message = `Delete user ${id} failed - ${err}`;
		semaLog.error(message);
		res.status(400).json({ message, err: `${err}` });
	}
});

router.put('/toggle/:id', async (req, res) => {
	semaLog.info('Users activate/deactivate - Enter ');
	const id = req.params.id;
	try {
		let user = await db.user.findOne({ where: { id: id } });
		if (!user) {
			throw new Error('User not found');
		}

		let updatedUser = await user.update({ active: !user.active });
		res.json({
			message: `User ${id} changed to ${
				user.active ? 'active' : 'not active'
				}`,
			user: await updatedUser.toJSON()
		});
	} catch (err) {
		const message = `Toggle user ${id} to ${
			user.active ? 'not active' : 'active'
			} failed - ${err}`;
		semaLog.error(message);
		res.status(400).json({
			messsage,
			err: `${err}`
		});
	}
});

router.get('/admin', async (req, res, next) => {
	semaLog.info('GET users - Enter');
	list.listAllUsers(req.query).then(({ data, total }) => {
		return res.json({ data, total });
	})
		.catch(next);
});

router.get('/admin/:id', async (req, res, next) => {
	semaLog.info('GET user - Enter');
	const id = parseInt(req.params.id);
	return findById.findUser(id)
		.then(data => res.status(200).json({ data }))
		.catch(Sequelize.EmptyResultError, handleError(res, 404))
		.catch(next);
});


router.post('/admin', async (req, res) => {
	semaLog.info('create user - enter');
	console.log('body', req.body)
	const {
		username,
		email,
		password,
		firstName,
		lastName,
		role,
		kiosk
	} = req.body;
	try {
		const user = await db.user.findOne({
			where: { [Op.or]: [{ email: email }, { username: username }] }
		});
		if (user) {
			semaLog.info('Email/username already exists');
			throw new Error('User already exists');
		}

		const createdUser = await db.user.create({
			username,
			email,
			password,
			first_name: firstName,
			last_name: lastName,
			active: true
		});
		let newUser = await createdUser.toJSON();

		const userRole = await db.user_role.create({
			role_id: role,
			user_id: newUser.id,
		});
		let newUserRole = await userRole.toJSON();

		const kioskUser = await db.kiosk_user.create({
			kiosk_id: kiosk,
			user_id: newUser.id,
			active: 1
		});


		console.log('createdUser', newUser);
		console.log('newUserRole', newUserRole);


		semaLog.info('User created success');
		res.json({ data: newUser })
	} catch (err) {
		semaLog.error(`Create user failed - ${err}`);
		res.status(400).json({
			message: `Failed to create user ${err}`,
			err: `${err}`
		});
	}
});

router.put('/admin/:id', async (req, res) => {
	semaLog.info(`UPDATE user ${req.params.id} - enter`);
	const {
		username,
		email,
		password,
		firstName,
		lastName,
		role,
		kiosk
	} = req.body;
	console.log('body', req.body);

	try {

		const createdUser = await db.user.update({
			username,
			email,
			first_name: firstName,
			last_name: lastName,
			active: true
		}, { where: { id: req.params.id } });

		const checkUserRole = await db.user_role.findOne({
			where: { user_id: req.params.id }
		});

		console.log('checkUserRole', checkUserRole);

		if (checkUserRole) {
			const userRole = await db.user_role.update({
				role_id: role,
			}, { where: { user_id: req.params.id } }
			);
		}

		if (!checkUserRole) {
			if (role != 'N/A') {
				await db.user_role.create({
					role_id: role,
					user_id: req.params.id,
				});
			}

		}




		const checkKioskUser = await db.kiosk_user.findOne({
			where: { user_id: req.params.id }
		});

		if (checkKioskUser) {
			const kioskUser = await db.kiosk_user.update({
				kiosk_id: kiosk,
				active: 1
			}, { where: { user_id: req.params.id } });
		}

		if (!checkKioskUser) {
			if (kiosk != 'N/A') {
				await db.kiosk_user.create({
					kiosk_id: kiosk,
					user_id: req.params.id,
				});
			}
		}


		var update = await db.user.findByPk(req.params.id);
		semaLog.info('User created success');
		res.json({ data: update })
	} catch (err) {
		semaLog.error(`Create user failed - ${err}`);
		res.status(400).json({
			message: `Failed to create user ${err}`,
			err: `${err}`
		});
	}

});

function handleError(res, statusCode, message) {
	return (error) => {
		return res.status(statusCode).json({ message: message || error.message });
	};
}

module.exports = router;
