import React, { useState, useEffect } from 'react';

function CredentialList() {
    const [credentials, setCredentials] = useState([]);

    useEffect(() => {
        // Fetch credentials on component mount
        fetch('/api/getCredentials')
            .then(response => response.json())
            .then(data => setCredentials(data));
    }, []);

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