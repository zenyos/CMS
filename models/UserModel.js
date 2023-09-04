const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    level: {
        type: Number,
        default: 0
    },

    avatar: {
        type: String,
        default: 'def_avatar.png'
    },

    websiteAddress: {
        type: String,
        default: ''
    },

    phoneNumber: {
        type: String,
        default: ''
    },

    aboutUser: {
        type: String,
        default: ''
    }

});

module.exports = {User: mongoose.model('user', UserSchema )};