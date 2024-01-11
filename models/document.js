const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    docName: {
        type: String,
        trim: true
    },
    docUrl: {
        type: String,
        trim: true
    },
    docGeneratedOn: {
        type: Date,
    },
    docSignedOn: {
        type: Date,
    },
    signature: {
        type: String,
        trim: true
    },
    publicId: {
        type: String,
        trim: true
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('DocumentSchema', documentSchema, 'document');