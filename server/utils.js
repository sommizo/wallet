const mongoose = require('mongoose');
const redis = require('redis');
const config = require('./config/config');

async function connectToMongo() {
  try {
    await mongoose.connect(config.mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB with error - ', err);
  }
}

async function connectToRedis() {
  const redisClient = redis.createClient({ url: config.redis.url });

  try {
    await new Promise((resolve, reject) => {
      redisClient.connect();
      redisClient.on('connect', resolve);
      redisClient.on('error', (err) => reject(err));
    });

    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis with error - ', err);
  }
}

module.exports = {
  connectToMongo,
  connectToRedis,
};