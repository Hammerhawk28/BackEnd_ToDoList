const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

//function to register new user
const register = async (req, res) => {
    if (!req.body.email || !req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({"message": "Form included missing fields"});
    }
    const newUser = new User();
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.setPassword(req.body.password);
    newUser.setID(req.body.username);
    try {
        await User.create(newUser);
        const token = newUser.generateJwt();
        console.log(token)
        res.status(200).json({token});
    } catch (err) {
        res.status(500).json(err.message);
    }

}

//functioin to log in existing user
const login = (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({"message": "Missing fields included"});
    }
    console.log("Trying to authentiticate");
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(500).json(err);
        }
        if (user) {
            const token = user.generateJwt();
            res.status(200).json({token});
        } else {
            res.status(401).json(info);
        }
    }) (req, res);
};




module.exports = {
    register,
    login
}