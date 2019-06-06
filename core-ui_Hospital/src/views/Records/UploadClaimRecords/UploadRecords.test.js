import React from 'react';
import UploadClaimRecords from './UploadClaimRecords';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<UploadClaimRecords />);
});
