import React from 'react';
import ReactDOM from 'react-dom';
import ShareRecords from './ShareRecords';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ShareRecords />, div);
  ReactDOM.unmountComponentAtNode(div);
});