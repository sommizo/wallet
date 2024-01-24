import React, { useState, useEffect } from 'react';

function CredentialList() {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_GET_CREDENTIALS_URL = '/api/getCredentials';

    useEffect(() => {
        // Fetch credentials on component
        fetch(API_GET_CREDENTIALS_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setCredentials(data))
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
            <ul>
                {credentials.map((credential, index) => (
                    <li key={index}>{JSON.stringify(credential)}</li>
                ))}
            </ul>
        </div>
    );
}

export default CredentialList;