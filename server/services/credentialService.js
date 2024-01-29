const Credential = require('../models/credential');
const { connectToRedis } = require('../utils');
// In-memory credentials cache
const { credentialsCache } = require('../credentialsCache');

// Add the new credential data to both MongoDB and the Redis queue
const addCredential = async (req, res) => {
    const redisClient = await connectToRedis();
    try {
        const newCredential = new Credential(req.body);
        await newCredential.save();

        const event = {
            eventType: 'create',
            credentialData: req.body,
            timestamp: new Date().toISOString(),
        };
        await redisClient.lPush('credentialsQueue', JSON.stringify(event));

        // Add the event to credentialsCache
        credentialsCache.push(JSON.parse(JSON.stringify(event)).credentialData);

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding credential:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (redisClient && redisClient.connected) {
            await redisClient.disconnect();
            console.log('Disconnected from Redis');
        }
    }
};

// Get credentials from MongoDB
const getCredentialsFromMongo = async (req, res) => {
    try {
        const credentials = await Credential.find();
        res.json(credentials);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get credentials from Redis queue or cache
const getCredentials = async (req, res) => {
    try {
        let redisClient;
        try {
            redisClient = await connectToRedis();

            // Fetch data from Redis queue
            const credentialsQueue = await redisClient.lRange('credentialsQueue', 0, -1);
            const parsedCredentialsQueue = credentialsQueue.map(JSON.parse).map((item) => item.credentialData);
            // parsedCredentialsQueue = fetchCredentialsfromRedis(redisClient)

            // TODO - Update credentialsCache
            // credentialsCache.length = 0;
            // credentialsCache.push(JSON.stringify(parsedCredentialsQueue));
            res.json(parsedCredentialsQueue);
        } catch (error) {
            console.error('Error getting credentials from Redis queue:', error);

            // Check if Redis is not available and cache has data
            if (!redisClient || (!redisClient.connected && credentialsCache.length > 0)) {
                console.log('Serving data from cache : ' + credentialsCache);
                res.json(credentialsCache);
            } else {
                // Respond with an error if both Redis and cache are unavailable
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } finally {
            if (redisClient && redisClient.connected) {
                await redisClient.disconnect();
                console.log('Disconnected from Redis');
            }
        }
    } catch (error) {
        console.error('Error in getCredentials:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// const fetchCredentialsfromRedis = async (redisClient) => {
//     const credentialsQueue = await redisClient.lRange('credentialsQueue', 0, -1);
//     return credentialsQueue.map(JSON.parse).map((item) => item.credentialData);
// };


const initializeCredentials = async () => {
    const initialCredentials = [
        { walletId: 34, credentialType: 'diplome', credential: { nom: 'bac', annee: 2023, etablissement: 'lycee Émile Sabord' } },
        { walletId: 34, credentialType: 'driver licence', credential: { annee: 2020, id: '33434', type: 'B', firstname: 'Mehdi', lastname: 'Khaman' } },
        { walletId: 34, credentialType: 'employee', credential: { firstname: 'mehdi', lastname: 'khaman', annee: 2020, matricule: '434', role: 'manager bu digital trust services' } }
    ];

    try {
        for (const credentialData of initialCredentials) {
            await addCredential({ body: credentialData }, { json: () => { } });
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