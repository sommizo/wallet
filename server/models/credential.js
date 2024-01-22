const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    walletId: Number,
    credentialType: String,
    credential: Object,
});

const Credential = mongoose.model('Credential', credentialSchema);

module.exports = Credential;