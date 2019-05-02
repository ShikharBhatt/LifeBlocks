import React from 'react';
import ReactDOM from 'react-dom';
import RevokeAccess from './RevokeAccess';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RevokeAccess />, div);
  ReactDOM.unmountComponentAtNode(div);
});