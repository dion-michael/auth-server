const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helpers/errorHandler');

class UserController {
    static async getAll(req, res) {
        try {
            const allUsers = await User.find();
            res.json(allUsers);
        } catch (error) {
            throw {
                code: 500,
                message: 'server error'
            }
        }
    }

    static async login(req, res, next) {
        try {
            let user = await User.findOne({
                email: req.body.email,
            });
            if (user) {
                let isValid = bcrypt.compareSync(
                    req.body.password,
                    user.password,
                );
                if (isValid) {
                    let token = jwt.sign(
                        {
                            username: user.username,
                            email: user.email,
                            id: user._id,
                        },
                        process.env.JWT_SECRET,
                    );
                    res.json({
                        token,
                        email: user.email,
                        id: user._id,
                    });
                } else {
                    throw {
                        code: 400,
                        message: 'wrong email/password',
                    };
                }
            } else {
                throw {
                    code: 404,
                    message: 'wrong email/password',
                };
            }
        } catch (error) {
            next(error);
        }
    }

    static async register(req, res, next) {
        try {
            // if (!req.body.email) {
            //     throw new ErrorHandler(400, 'email is required');
            // }
            let newUser = new User({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
            });
            res.json(await newUser.save());
        } catch (error) {
            console.log(`error`, error)
            next(error);
        }
    }
}

module.exports = UserController;
