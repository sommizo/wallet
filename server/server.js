const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const bodyParser = require('body-parser');
const credentialRoutes = require('./routes/credetialRoutes');
const config = require('./config/config');
const { connectToMongo, connectToRedis } = require('./utils');

initialize();

async function initialize() {
  await connectToMongo();
  await connectToRedis();

  const app = express();
  app.use(bodyParser.json());
  app.use('/api', credentialRoutes);
  
  app.use((req, res, next) => {
    res.status(404).send('Not Found');
  });
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}