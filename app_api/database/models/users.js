const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');

const userSchema = new mongoose.Schema({
     email: { type: String, unique: true, required: true},
     username: { type: String, unique: true, required: true},
     userID: { type: String, unique: true, required: true},
     hash: String,
     salt: String
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return hash === this.hash;
};

userSchema.methods.setID = function(username) {
    let userID = uniqid(username + '-');
    this.userID = userID;
};

userSchema.methods.generateJwt = function () {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        userID: this.userID,
        exp: parseInt(expiry.getTime() / 1000, 10),
    }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('users', userSchema);

