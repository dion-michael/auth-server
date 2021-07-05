const router = require('express').Router()

router.use('/users', require('./userRoutes.js'))
router.use('/', (req, res) => res.json({success: true}))

module.exports = router