const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToMongo } = require('./services/connections');
const { initializeCredentials } = require('./services/credentialService');

initialize();

async function initialize() {
  try {
    await connectToMongo();
   
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.use('/api', require('./routes/credetialRoutes'));

    app.use((res) => {
      res.status(404).send('Not Found');
    });
    ////// AUTHENTIFICATION ////////////

// const publicKeyStore = {};

// const options = {
//   timeout: 60000,
//   rpId: 'localhost',
//   challengeSize: 32,
//   authenticatorAttachment: 'cross-platform',
//   authenticatorRequireResidentKey: false,
//   authenticatorUserVerification: 'required',
//   attestationPreference: 'none',
// };

// const server = new fido2.Fido2Lib(options);

// app.post('/register/options', async (req, res) => {
//   try {
//     const user = {
//       id: 'someUserId', 
//       name: 'John Jacques',
//       displayName: 'John',
//     };

//     const publicKeyOptions = await server.attestationOptions(user);
//     res.json(publicKeyOptions);
//   } catch (error) {
//     console.error('Error in /register/options:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post('/register/result', async (req, res) => {
//   try {
//     const user = {
//       id: 'someUserId',
      
//       name: 'John Jacques',
//       displayName: 'John',
//     };

//     const result = await server.attestationResult({
//       credential: req.body,
//       expectedChallenge: req.session.challenge,
//     });

//     publicKeyStore[user.id] = result.authnrData.get('credentialPublicKey');

//     res.json({ success: true });
//   } catch (error) {
//     console.error('Error in /register/result:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post('/authenticate/options', async (req, res) => {
//   try {
//     const user = {
//       id: 'someUserId',
//       name: 'John Jacques',
//       displayName: 'John',
//     };

//     const publicKeyOptions = await server.assertionOptions(user);
//     res.json(publicKeyOptions);
//   } catch (error) {
//     console.error('Error in /authenticate/options:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post('/authenticate/result', async (req, res) => {
//   try {
//     const user = {
//       id: 'someUserId',
//       name: 'John Jacques',
//       displayName: 'John',
//     };

//     const storedPublicKey = publicKeyStore[user.id];

//     const result = await server.assertionResult({
//       credential: req.body,
//       expectedChallenge: req.session.challenge,
//       expectedOrigin: 'http://localhost:3000',
//       userVerification: 'required',
//     });

//     const isValid = fido2.verifySignature(
//       storedPublicKey,
//       result.authnrData.get('credentialID'),
//       result.signature,
//       result.authnrData.get('clientDataHash')
//     );

//     if (isValid) {
//       res.json({ success: true });
//     } else {
//       res.status(401).json({ error: 'Authentication failed' });
//     }
//   } catch (error) {
//     console.error('Error in /authenticate/result:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

////// AUTHENTIFICATION ////////////

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
    await initializeCredentials();
  } catch (error) {
    console.error('Failed to initialize with error - ', error);
  }
}