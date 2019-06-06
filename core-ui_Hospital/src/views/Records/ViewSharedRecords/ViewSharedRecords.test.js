import React from 'react';
import ViewSharedRecords from './ViewSharedRecords';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<ViewSharedRecords />);
});
