const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const { connectToMongo, connectToRedis } = require('./utils');
const { initializeCredentials } = require('./services/credentialService');

initialize();

async function initialize() {
  try {
    await connectToMongo();
    let redisClient = await connectToRedis();

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.use('/api', require('./routes/credetialRoutes'));

    app.use((req, res, next) => {
      res.status(404).send('Not Found');
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
    await initializeCredentials(redisClient);
  } catch (error) {
    console.error('Failed to initialize with error - ', error);
  }
}