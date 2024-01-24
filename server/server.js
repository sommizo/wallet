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

// Initialize some credentials
// const initializeCredentials = async () => {
//   const initialCredentials = [
//     { walletId : 34 , credentialType : ' diplome ', credential :
//     { nom : ' bac ' , annee : 2023 , etablissement : ' lycee Émile Sabord '} },
//     { walletId : 34, credentialType : ' driver licence ', credential :
//     { annee : 2020 , id: ' 33434 ', type : ' B ' , firsname : ' Mehdi', lastname : ' Khaman ' }},
//     { walletId : 34, credentialType : 'employee', credential :
//     { firstname : 'mehdi'  , lastname : ' khaman ' , annee : 2020 , matricule: ' 434 ', role: 'manager bu digital trust services' }}
//   ];

//   for (const credentialData of initialCredentials) {
//       const newCredential = new Credential(credentialData);
//       await newCredential.save();
//   }
// };