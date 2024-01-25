import React, { useState, useEffect } from 'react';

function CredentialList() {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                } else {
                    throw new Error('Empty or invalid response');
                }
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, []);

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
                            <td>{credential.walletId}</td>
                            <td>{credential.credentialType}</td>
                            <td>{JSON.stringify(credential.credential)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CredentialList;