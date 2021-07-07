const router = require('express').Router();

const User = require('../models/User');
const { excludedValue } = require('../configs'); 
const Authorize = require('../middlewares/Authorize');
const excludeSensitiveData = require('../helpers/excludeSensitiveData');
const userController = require('../controllers/userController');
const ProductController = require('../controllers/productController');


router.get('/', ProductController.getAll);
router.post('/', Authorize, ProductController.createProduct);
router.delete('/:product_id', Authorize, ProductController.deleteProduct);

module.exports = router