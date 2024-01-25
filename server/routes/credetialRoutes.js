const express = require('express');
const credentialService = require('../services/credentialService.js');

const router = express.Router();

router.post('/addCredential', credentialService.addCredential);
router.get('/getCredentials', credentialService.getCredentials);
router.get('/getUpdates', credentialService.getUpdates);

module.exports = router;