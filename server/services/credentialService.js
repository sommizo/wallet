const Credential = require('../models/credential');
const redis = require('redis');
const config = require('../config/config');

const addCredential = async (redisClient, req, res) => {
    try {
        const newCredential = new Credential(req.body);
        await newCredential.save();

        const event = {
            eventType: 'create',
            credential: req.body,
            timestamp: new Date().toISOString(), 
        };

        // Add event at the beginning of list
        redisClient.rPush('credentialsQueue', JSON.stringify(event));
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