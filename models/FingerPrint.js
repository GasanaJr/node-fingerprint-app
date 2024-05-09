const mongoose = require('mongoose');

const fingerprintSchema = new mongoose.Schema({
    fingerprintTemplate: String,
    userId: String,
    captureDate: {
        type: Date,
        default: Date.now()
    }

});

const FingerPrint = mongoose.model('FingerPrint', fingerprintSchema);

module.exports = FingerPrint;