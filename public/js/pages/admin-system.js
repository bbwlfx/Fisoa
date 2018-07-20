import { render } from 'react-dom';
import React from 'react';
import { Router, browserHistory } from 'react-router';
import AdminRoute from '../router/admin-system';

render(
  <Router history={browserHistory} routes={AdminRoute} />,
  document.getElementById('root')
);
