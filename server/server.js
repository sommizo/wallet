const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const bodyParser = require('body-parser');
const credentialRoutes = require('./routes/credetialRoutes');
const config = require('./config/config');

const app = express();

// Connexion to Mongo
mongoose.connect(config.mongo.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB with error - ', err));

// Connect to Redis
const redisClient = redis.createClient({url:config.redis.url});
redisClient.connect()
.then(() => console.log('Connected to Redis'))
.catch((err) => console.error('Failed to connect to Redis with error - ', err));


app.use(bodyParser.json());
app.use('/api', credentialRoutes);

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});