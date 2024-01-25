import React, { useState, useEffect } from 'react';

function CredentialList() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localDatabase, setLocalDatabase] = useState([]);

  const API_GET_CREDENTIALS_URL = 'http://localhost:3001/api/getCredentials';

  useEffect(() => {
    // Fetch credentials
    fetch(API_GET_CREDENTIALS_URL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCredentials(data);
          updateLocalDatabase(data);
        } else {
          throw new Error('Empty or invalid response');
        }
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Set up EventSource to receive updates
    const eventSource = new EventSource('http://localhost:3001/api/updates');

    // Handle updates
    eventSource.onmessage = (event) => {
      const updatedCredentials = JSON.parse(event.data);
      setCredentials(updatedCredentials);
      updateLocalDatabase(updatedCredentials);
    };

    // Close EventSource on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  const updateLocalDatabase = (data) => {
    setLocalDatabase(data);
    // Persist the data locally
    localStorage.setItem('localWalletDatabase', JSON.stringify(data));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Wallet App</h1>
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
