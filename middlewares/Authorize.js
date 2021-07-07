const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { CustomError } = require('../middlewares/ErrorHandler');

module.exports = async function (req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) {
            throw new CustomError(401, 'unauthorized')
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({username: decoded.username});
            if (user) {
                next()
            } else {
                throw new CustomError(404, 'user not found')
            }
        }
    } catch (error) {
        next(error)
    }
}
