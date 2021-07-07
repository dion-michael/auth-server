const router = require('express').Router();

const userRoutes = require('./users');
const UserController = require('../controllers/userController');
const passport = require('passport');
const { CustomError } = require('../middlewares/ErrorHandler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const excludeSensitiveData = require('../helpers/excludeSensitiveData');
const { excludedValue } = require('../configs');
const Authorize = require('../middlewares/Authorize');
const productRoutes = require('./products');

router.post('/register', UserController.createUser);

router.post('/login', UserController.login);

router.post('/login/token', Authorize, UserController.loginToken);

router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login/google/failed',
    session: false,
}), async (req, res, next) => {
    const googleUser = req.user._json;
    try {
        const user = await User.findOne({email: googleUser.email});
        let payload = {};
        if (user) {
            if (!user.avatar) {
                await User.findOneAndUpdate({email: googleUser.email}, {avatar: googleUser.picture})
            };
            const token = jwt.sign(excludeSensitiveData(user.toJSON(), excludedValue), process.env.JWT_SECRET);
            payload = {
                token,
                username: user.username,
                avatar: user.avatar,
                email: user.email,
            }
        } else {
            const newUser = new User({
                username: googleUser.given_name + googleUser.family_name,
                password: 'defaultpassword',
                email: googleUser.email,
                avatar: googleUser.picture,
            });
            await newUser.save();
            const token = jwt.sign(excludeSensitiveData(newUser.toJSON(), excludedValue), process.env.JWT_SECRET);
            payload = {
                token,
                username: newUser.username,
                avatar: newUser.avatar,
                email: newUser.email,
            }
        }
        return res.redirect(`${process.env.REACT_APP_URL}/login?payload=${JSON.stringify(payload)}`);
    } catch (error) {
        next(error)
    }
})

router.get('/login/google/failed', (req, res, next) => {
    next(new CustomError(500, 'failed when authenticating with google'))
});

router.use('/users', userRoutes);

router.use('/products', productRoutes)

router.get('/', (_, res) => {
    return res.json({ healthcheck: 'OK' });
});

module.exports = router