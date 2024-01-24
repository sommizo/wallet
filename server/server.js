const express = require('express');
const bodyParser = require('body-parser');
const credentialRoutes = require('./routes/credetialRoutes');
const { connectToMongo, connectToRedis } = require('./utils');
const { addCredential } = require('./services/credentialService');

initialize();

async function initialize() {
  try {
    await connectToMongo();
    let redisClient = await connectToRedis();
    await initializeCredentials(redisClient);

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
      await addCredential({ body: credentialData }, { json: () => { } }, redisClient);
    }

    console.log('Credentials initialized successfully');
  } catch (error) {
    console.error('Failed to initialize credentials with error - ', error);
  }
};

// const initializeCredentials = async () => {
//   const initialCredentials = [
//     { walletId: 34, credentialType: 'diplome', credential: { nom: 'bac', annee: 2023, etablissement: 'lycee Émile Sabord' } },
//     { walletId: 34, credentialType: 'driver licence', credential: { annee: 2020, id: '33434', type: 'B', firsname: 'Mehdi', lastname: 'Khaman' } },
//     { walletId: 34, credentialType: 'employee', credential: { firstname: 'mehdi', lastname: 'khaman', annee: 2020, matricule: '434', role: 'manager bu digital trust services' } }
//   ];

//   try {
//     for (const credentialData of initialCredentials) {
//       await addCredential({ body: credentialData }, { json: () => { } });
//     }

//     console.log('Credentials initialized successfully');
//   } catch (error) {
//     console.error('Failed to initialize credentials with error - ', error);
//   }
// }
