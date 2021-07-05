const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../helpers/errorHandler');

const UserSchema = new Schema({
    username: {
        type: String,
        validate: {
            validator: async function () {
                let isUsed = await User.findOne({
                    username: this.username,
                    _id: {
                        $ne: this._id,
                    },
                });
                if (isUsed) {
                    throw {
                        code: 400,
                        message: `${this.username} is already in use`,
                    };
                } else {
                    return true;
                }
            },
        },
    },
    email: {
        type: String,
        validate: {
            validator: async function () {
                let isUsed = await User.findOne({
                    email: this.email,
                    _id: {
                        $ne: this._id,
                    },
                });
                if (isUsed) {
                    return false;
                } else {
                    return true;
                }
            },
            message: (data) => `${data.value} is already in use`,
        },
    },
    password: String,
    created: Date,
});

UserSchema.pre('save', async function (next) {
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema)

module.exports = User