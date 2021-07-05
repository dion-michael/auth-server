const userController = require('../controllers/userController')
const router = require('express').Router()
const {
    Authenticate
} = require('../middleware/auth')

router.get('/', Authenticate, userController.getAll)
router.post('/register', userController.register)
router.post('/login', userController.login)

module.exports = router