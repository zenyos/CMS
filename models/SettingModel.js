const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingSchema = new Schema({

    websiteName: {
        type: String,
        default: 'Blog'
    },
    websiteCopyright: {
        type: String,
        default: 'Copyright © Your Website Today'
    },
    websiteTheme: {
        type: String,
        default: 'default'
    },
    websiteLanguage: {
        type: String,
        default: 'en'
    },
    websiteDirection: {
        type: String,
        default: 'ltr'
    },
    websitePaginationLimit: {
        type: Number,
        default: 2
    },
    websiteTelegramURL: {
        type: String,
        default: ''
    },
    websiteInstagramURL: {
        type: String,
        default: ''
    },
    websiteGooglePlusURL: {
        type: String,
        default: ''
    },
    websiteTwitterURL: {
        type: String,
        default: ''
    },
    websiteLinkedInURL: {
        type: String,
        default: ''
    },
    websiteFacebookURL: {
        type: String,
        default: ''
    }

});

module.exports = {Setting: mongoose.model('setting', SettingSchema)};