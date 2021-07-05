const jwt = require('jsonwebtoken');

function Authenticate(req, res, next) {
    try {
        if (req.headers.hasOwnProperty('token')) {
            const decode = jwt.verify(req.headers.token, process.env.JWT_SECRET)
            req.loggedUser = decode
            next()
        } else {
            throw ({
                code: 401,
                message: "you have to login first"
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    Authenticate,
}