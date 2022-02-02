const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        // Login
        // check if email exists
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { message: 'That email is not registered' });
        }
        // check if password is correct
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, { message: 'Logged in successfully' });
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        }).catch(err => {
            console.log(err);
            return done(null, false, { message: 'Something went wrong' })
        })

    }));
    //The user id (you provide as the second argument of the done function) is saved in the session and is later used to retrieve the whole object via the deserializeUser function.
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
}

module.exports = init;