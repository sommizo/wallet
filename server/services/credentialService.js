const Credential = require('../models/credential');
const { connectToRedis } = require('../utils');

// Add the new credential data to both MongoDB and the Redis queue
const addCredential = async (redisClient, req, res) => {
    try {
        const newCredential = new Credential(req.body);
        await newCredential.save();

        const event = {
            eventType: 'create',
            credential: req.body,
            timestamp: new Date().toISOString(),
        };
        await redisClient.lPush('credentialsQueue', JSON.stringify(event));
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding credential:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get credentials from MongoDB
const gggetCredentials = async (req, res) => {
    try {
      const credentials = await Credential.find();
      console.log('credentials:' + credentials)
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Get credentials from Redis queue
const getCredentials = async (req, res) => {
    try {
        const redisClient = await connectToRedis();
        const credentialsQueue = await redisClient.lRange('credentialsQueue', 0, -1);
        const parsedCredentialsQueue = credentialsQueue.map(JSON.parse).map((item) => item.credential);
        res.json(parsedCredentialsQueue);
    } catch (error) {
        console.error('Error getting credentials from Redis queue:', error);

        // Check if res is an instance of the Express response object
        if (res && res.status) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error('Invalid response object:', res);
        }
    }
    finally {
        //redisClient.close()
    }
};
const initializeCredentials = async (redisClient) => {
    const initialCredentials = [
      { walletId: 34, credentialType: 'diplome', credential: { nom: 'bac', annee: 2023, etablissement: 'lycee Émile Sabord' } },
      { walletId: 34, credentialType: 'driver licence', credential: { annee: 2020, id: '33434', type: 'B', firstname: 'Mehdi', lastname: 'Khaman' } },
      { walletId: 34, credentialType: 'employee', credential: { firstname: 'mehdi', lastname: 'khaman', annee: 2020, matricule: '434', role: 'manager bu digital trust services' } }
    ];
  
    try {
      for (const credentialData of initialCredentials) {
        await addCredential(redisClient, { body: credentialData }, { json: () => { } });
      }
      console.log('Credentials initialized successfully');
  
    } catch (error) {
      console.error('Failed to initialize credentials with error - ', error);
    }
  };

module.exports = {
    addCredential,
    getCredentials,
    initializeCredentials,
};