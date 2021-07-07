const router = require('express').Router();

const User = require('../models/User');
const { excludedValue } = require('../configs'); 
const Authorize = require('../middlewares/Authorize');
const excludeSensitiveData = require('../helpers/excludeSensitiveData');


router.get('/', Authorize, async (req, res, next) => {
    try {
        const users = await User.find();
        const safeData = users.map(user => {
            return excludeSensitiveData(user.toJSON(), excludedValue)
        });
        return res.json(safeData);
    } catch (error) {
        next(error)
    }
});

module.exports = router