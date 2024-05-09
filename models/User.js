const mongoose = require('mongoose');

const userBioSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    fingerprint:{
        type: String,
        required: false
    }
});

const userBio = mongoose.model('userBio', userBioSchema);

module.exports = userBio;