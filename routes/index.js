const router = require('express').Router();

const userRoutes = require('./users');
const UserController = require('../controllers/userController');

router.post('/register', UserController.createUser);

router.post('/login', UserController.login);

router.use('/users', userRoutes);

router.get('/', (_, res) => {
    return res.json({ healthcheck: 'OK' });
});

module.exports = router