const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userDao = require('../data_access/userDao')
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://auth-example1.herokuapp.com/google/callback',
        passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
        done(null, profile);
    },
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})