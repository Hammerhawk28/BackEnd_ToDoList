const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    name: {type: String, required: true},
    userID: {type: String, required: true},
    priority: {type: String, required: true},
    description: {type: String, required: false},
    status: {type: String, required: false, default: "Not Started"},
    estTime: {type: String, required: false}
});

listSchema.index({ name: 1, userID: 1}, {unique: true});

module.exports = mongoose.model('lists', listSchema);