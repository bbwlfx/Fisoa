import { render } from 'react-dom';
import React from 'react';
import { Router, browserHistory } from 'react-router';
import userspaceRoute from '../router/userspace';

render(
  <Router history={browserHistory} routes={userspaceRoute} />,
  document.getElementById('root')
);
