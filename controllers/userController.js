const User = require("../models/User")
const excludeSensitiveData = require('../helpers/excludeSensitiveData');
const { excludedValue } = require('../configs');

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
}

module.exports = UserController;
