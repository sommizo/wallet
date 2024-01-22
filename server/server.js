const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const credentialRoutes = require('./routes/credetialRoutes');
const config = require('./config/config');

const app = express();

mongoose.connect(config.mongo.url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use('/api', credentialRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});