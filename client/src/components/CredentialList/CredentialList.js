import React, { useState, useEffect } from 'react';

function CredentialList() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedFromServer, setLoadedFromServer] = useState(false);

  const API_GET_CREDENTIALS_URL = 'http://localhost:3001/api/getCredentials';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_GET_CREDENTIALS_URL, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCredentials(data);
        setLoadedFromServer(true);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Load data from local storage if API request fails
        const localData = localStorage.getItem('localWalletDatabase');
        setLoadedFromServer(false);
        if (localData) {
          setCredentials(JSON.parse(localData));
        } else {
          console.error('Local data not available');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Wallet App</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Data {loadedFromServer ? 'loaded from server' : 'loaded from local DB'}*</p>
          <table className="credential-table">
            <thead>
              <tr>
                <th>Wallet ID</th>
                <th>Credential Type</th>
                <th>Credential Data</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((credential, index) => (
                <tr key={index}>
                  <td style={{ verticalAlign: 'middle' }}>{credential.walletId}</td>
                  <td>{credential.credentialType}</td>
                  <td>
                    <pre>{formatCredentialData(credential.credential)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Format credentials data
function formatCredentialData(credentialData) {
  return Object.entries(credentialData)
    .map(([key, value]) => (
      <div key={key}>
        <strong>{key}:</strong> {value}
      </div>
    ));
}

export default CredentialList;