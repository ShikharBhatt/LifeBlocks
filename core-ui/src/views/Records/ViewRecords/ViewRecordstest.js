import React from 'react';
import ViewRecords from './ViewRecords';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<ViewRecords />);
});
