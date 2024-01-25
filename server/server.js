const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const { connectToMongo, connectToRedis } = require('./utils');
const { addCredential } = require('./services/credentialService');

initialize();

async function initialize() {
  try {
    await connectToMongo();
    let redisClient = await connectToRedis();
    await initializeCredentials(redisClient);

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // Create a Redis client for pub/sub
    const redisPubSub = redis.createClient();

    app.use('/api', (req, res, next) => {
      // Pass the Redis pub/sub client to the routes
      req.redisPubSub = redisPubSub;
      next();
    });

    app.use('/api', require('./routes/credetialRoutes'));

    app.use((req, res, next) => {
      res.status(404).send('Not Found');
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize with error - ', error);
  }
}

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
  } finally {
    // Close the Redis client after initializing credentials
    //redisClient.quit();
  }
};

module.exports = { initializeCredentials };
