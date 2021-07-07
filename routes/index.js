const router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRoutes = require('./users');
const User = require('../models/User');
const { excludedValue } = require('../configs');
const excludeSensitiveData = require('../helpers/excludeSensitiveData');

router.post('/register', async (req, res, next) => {
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
});

router.post('/login', async (req, res, next) => {
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
});

router.use('/users', userRoutes);

router.get('/', (_, res) => {
    return res.json({ healthcheck: 'OK' });
});

module.exports = router