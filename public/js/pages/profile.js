import { render } from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { Router, browserHistory } from 'react-router';
import profileRoute from '../router/profile';
import profileStore from '../store/profile';

const initState = {
  fans: window.profileInfo.fans_count
};

render(
  <Provider store={profileStore(initState)}>
    <Router history={browserHistory} routes={profileRoute} />
  </Provider>,
  document.getElementById('root')
);
