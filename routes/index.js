const router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRoutes = require('./users');
const User = require('../models/User');
const { excludedValue } = require('../configs');
const excludeSensitiveData = require('../helpers/excludeSensitiveData');
const UserController = require('../controllers/userController');

router.post('/register', UserController.createUser);

router.post('/login', UserController.login);

router.use('/users', userRoutes);

router.get('/', (_, res) => {
    return res.json({ healthcheck: 'OK' });
});

module.exports = router