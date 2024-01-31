const mongoose = require('mongoose');
const redis = require('redis');
const config = require('../config/urls');

const { promisify } = require('util');

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

// Connect and subscribe to Redis
// const connectToRedis = async () => {
//   const redisClient = redis.createClient(config.redis);

//   const connectAsync = promisify(redisClient.connect).bind(redisClient);
//   const subscribeAsync = promisify(redisClient.subscribe).bind(redisClient);

//   try {
//     await connectAsync();
//     console.log('Connected to Redis');

//     const subscriber = redis.createClient(config.redis);
//     await subscribeAsync.call(subscriber, 'credentialsQueueUpdate');

//     return { publisher: redisClient, subscriber };
//   } catch (error) {
//     console.error(`Error connecting to Redis: ${error}`);
//     throw error;
//   }
// };

module.exports = {
  connectToMongo,
  connectToRedis,
};