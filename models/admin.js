const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const adminSchema = new Schema({
    emailAddress: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true, versionKey: false });

adminSchema.methods.comparePassword = function (password, cb) {

    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}


module.exports = mongoose.model('Admin', adminSchema, 'admin');