import React from 'react';
import ReactDOM from 'react-dom';
import CredentialList from './CredentialList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CredentialList />, div);
  ReactDOM.unmountComponentAtNode(div);
});