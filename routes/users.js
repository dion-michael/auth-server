const router = require('express').Router();

const User = require('../models/User');
const { excludedValue } = require('../configs'); 
const Authorize = require('../middlewares/Authorize');
const excludeSensitiveData = require('../helpers/excludeSensitiveData');
const userController = require('../controllers/userController')


router.get('/', Authorize, userController.getAll);

module.exports = router