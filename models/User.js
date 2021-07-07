const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

const UserSchema = new Schema({
    username: {
        type: String,
        validate: {
            validator: async function (value) {
                const user = await User.findOne({username: value});
                return user ? false : true;
            },
            message: props => `username ${props.value} already exists`,
        },
        required: [true, 'username is required'],
    },
    email: {
        type: String,
        validate: [
            {
                validator: async function (value) {
                    return emailRegex.test(value);
                },
                message: (props) => `${props.value} is not a valid email`,
            },
            {
                validator: async function (value) {
                    const user = await User.findOne({ email: value });
                    return user ? false : true;
                },
                message: (props) => `email ${props.value} already exists`,
            },
        ],
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        validate: {
            validator: async function (value) {
                return value.length >= 8;
            },
            message: 'password must be more than 8 characters',
        },
        required: [true, 'password is required'],
    },
    avatar: String,
});

UserSchema.pre('save', async function (next) {
    let salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
    next()
});

const User = model('User', UserSchema);

module.exports = User;
