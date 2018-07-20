import { render } from 'react-dom';
import React from 'react';
import Preview from 'containers/preview';
import preview from 'lib/preview';

const key = window.location.href.match(/\/preview\/(\w+)/)[1];

const data = JSON.parse(preview.getInfo(key));

render(
  <Preview data={data} />,
  document.getElementById('root')
);
