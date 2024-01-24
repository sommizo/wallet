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

const connectToRedis = () => {
  return new Promise((resolve, reject) => {
      const redisClient = redis.createClient(config.redis);
      redisClient.connect();
      redisClient.on('error', (err) => {
          console.log(`Error: ${err}`);
          reject(err);
      });

      redisClient.on('connect', () => {
          console.log('Connected to Redis');
          resolve(redisClient);
      });
  });
};

module.exports = {
  connectToMongo,
  connectToRedis,
};