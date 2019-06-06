import React from 'react';
import UploadRecords from './UploadRecords';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<UploadRecords />);
});
