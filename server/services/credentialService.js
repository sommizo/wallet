const Credential = require('../models/credential');
const redis = require('redis');
const config = require('../config/config');

const clients = [];

const pushUpdate = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.push(res);

    req.on('close', () => {
        // Remove the client when the connection is closed
        clients.splice(clients.indexOf(res), 1);
    });
};

// notify client
const sendUpdate = (updatedCredentials) => {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(updatedCredentials)}\n\n`);
    });
};


const addCredential = async (redisClient, req, res) => {
    try {
        const newCredential = new Credential(req.body);
        await newCredential.save();

        const event = {
            eventType: 'create',
            credential: req.body,
            timestamp: new Date().toISOString(),
        };

        // Add event at the beginning of the list
        redisClient.rPush('credentialsQueue', JSON.stringify(event));

        // Send update to connected clients
        sendUpdate([req.body]);

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
  
const getUpdates = (req, res) => {
    // Create a Redis pub/sub client for listening to updates
    const redisSub = req.redisPubSub.duplicate();
  
    redisSub.subscribe('credentialsUpdate');
    redisSub.on('message', (channel, message) => {
      res.write(`data: ${message}\n\n`);
    });
  
    // Close the Redis pub/sub client on client disconnect
    req.on('close', () => {
      redisSub.quit();
    });
  };

module.exports = {
    addCredential,
    getCredentials,
    getUpdates,
};
