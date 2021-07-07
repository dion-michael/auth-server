const User = require("../models/User")
const excludeSensitiveData = require('../helpers/excludeSensitiveData');
const { excludedValue } = require('../configs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../middlewares/ErrorHandler');
const userDao = require('../data_access/userDao');

class UserController{
    static getAll = async (req, res, next) => {
        try {
            const users = await User.find();
            const safeData = users.map(user => {
                return excludeSensitiveData(user.toJSON(), excludedValue)
            });
            return res.json(safeData);
        } catch (error) {
            next(error)
        }
    }

    static createUser = async (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            const newUser = new User({
                username,
                email,
                password,
            });
            const saved = await newUser.save();
            const safeData = excludeSensitiveData(saved.toJSON(), excludedValue);
            return res.json(safeData);
        } catch (error) {
            next(error)
        }
    }

    static login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            if (!username) throw new CustomError(400, 'username required');
            if (!password) throw new CustomError(400, 'password required');
            const user = await User.findOne({username});
            if (user) {
                const isValid = bcrypt.compareSync(password, user.password);
                if (isValid) {
                    const token = jwt.sign(excludeSensitiveData(user.toJSON(), excludedValue), process.env.JWT_SECRET);
                    return res.json({
                        token,
                        username,
                        avatar: user.avatar,
                        email: user.email,
                    })
                } else {
                    throw new CustomError(400, 'wrong username / password')
                }
            }
            throw new CustomError(404, 'user not found');
        } catch (error) {
            next(error)
        }
    }

    static loginToken = async (req, res, next) => {
        try {
            if (req.user) {
                res.json({ user: req.user });
            } else {
                throw new CustomError(400, 'unauthorized');
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController;
