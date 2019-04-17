import React from 'react';
import AcceptPolicy from './AcceptPolicy';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<AcceptPolicy />);
});
