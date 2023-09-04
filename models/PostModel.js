const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'public'
    },

    description: {
        type: String,
        required: true
    },

    description_more: {
        type: String,
        required: false
    },

    creationDate: {
        type: Date,
        default: Date.now()
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    category: {
        type: Array,
        ref: 'category'
    },

    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],

    allowComments: {
        type: Boolean,
        default: false
    },

    file: {
        type: String,
        default: ''
    },
    useDownloadBox: {
        type: Boolean,
        default: false
    },
    DownloadBoxContent: {
        type: String,
        default: ''
    },
    useGalleryBox: {
        type: Boolean,
        default: false
    },
    GalleryBoxContent: {
        type: String,
        default: ''
    },
    useLinkBox: {
        type: Boolean,
        default: false
    },
    LinkBoxContent: {
        type: String,
        default: ''
    },
    useInfoBox: {
        type: Boolean,
        default: false
    },
    InfoBoxContent: {
        type: String,
        default: ''
    },

});

module.exports = {Post: mongoose.model('post', PostSchema )};
