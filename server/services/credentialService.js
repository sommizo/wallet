const Credential = require('../models/credential');
const redis = require('redis');
const config = require('../config/config');

const client = redis.createClient(config.redis);

client.on('error', (err) => {
    console.log(`Error: ${err}`);
});

const addCredential = async (req, res) => {
    try {
        const newCredential = new Credential(req.body);
        await newCredential.save();
        //TODO fix publish to Redis
        //client.publish('credentials', JSON.stringify({ eventType: 'update' }));
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding credential:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCredentials = async (req, res) => {
    try {
        const credentials = await Credential.find();
        res.json(credentials);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    addCredential,
    getCredentials,
};