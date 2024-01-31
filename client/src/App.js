import React from 'react';
import CredentialList from './components/CredentialList/CredentialList';
import AuthenticationManager from './authentication/AuthenticationManager';

function App() {
    return (
        <div>
            <AuthenticationManager />
            <CredentialList />
        </div>
    );
}

export default App;
