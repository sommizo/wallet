import { useState, useEffect } from 'react';

const AuthenticationManager = () => {
  const [userVerification] = useState(false);

  const generateCreateOptions = (serverOptions) => {
    return {
      publicKey: {
        challenge: serverOptions.challenge,
        rp: serverOptions.rp,
        user: serverOptions.user,
        pubKeyCredParams: serverOptions.pubKeyCredParams,
        authenticatorSelection: serverOptions.authenticatorSelectionCriteria,
        timeout: serverOptions.timeout,
      },
    };
  };

  const generateGetOptions = (serverOptions) => {
    return {
      publicKey: {
        challenge: serverOptions.challenge,
        allowCredentials: serverOptions.allowCredentials,
        rpId: serverOptions.rpId,
        userVerification: userVerification ? 'required' : 'discouraged',
      },
    };
  };

  useEffect(() => {
    const registerAndAuthenticate = async () => {
      try {
        // Registration
        const createOptionsResponse = await fetch('http://localhost:3001/register/options');
        console.log('/register/options done')
        const createOptions = await createOptionsResponse.json();

        const registrationCredential = await navigator.credentials.create(
          generateCreateOptions(createOptions)
        );

        const registrationResponse = await fetch('http://localhost:3001/register/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationCredential),
        });
        console.log('/register/result done')

        if (registrationResponse.ok) {
          console.log('Credential registered successfully');

          // Authentication
          const getOptionsResponse = await fetch('http://localhost:3001/authenticate/options');
          console.log('//authenticate/options done')
          const getOptions = await getOptionsResponse.json();

          const authenticationCredential = await navigator.credentials.get(
            generateGetOptions(getOptions)
          );

          const authenticationResponse = await fetch('http://localhost:3001/authenticate/result', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(authenticationCredential),
          });
          console.log('/authenticate/result done')

          if (authenticationResponse.ok) {
            console.log('Authentication successful');
          } else {
            console.error('Authentication failed');
          }
        } else {
          console.error('Failed to register credential');
        }
      } catch (error) {
        console.error('Error during registration or authentication:', error);
      }
    };

    registerAndAuthenticate();
  }, []);

  return null;
};

export default AuthenticationManager;