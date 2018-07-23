import { render } from 'react-dom';
import React from 'react';
import Story from '../containers/story';

render(
  <Story {...window.__PROPS__} />,
  document.getElementById('root')
);
