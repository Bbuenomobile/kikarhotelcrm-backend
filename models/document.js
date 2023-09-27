const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('DocumentSchema', documentSchema, 'document');