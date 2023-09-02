const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');


//Create loacl statrgy for passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},
async (username, password, done) => {
    try {
        const user = await User.findOne({email: username});
        if (!user) {
            return done(null, false, {
                message: "Incorrect Username"
            });
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: "Incorrect Password"
            });
        }
        return done(null, user);
    } catch (err) {
        console.log(err);
        return done(err);
    }
    }
));
