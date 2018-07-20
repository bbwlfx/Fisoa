import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';
import Userspace from '../containers/userspace';
import Article from '../containers/userspace/content/article';
import Question from '../containers/userspace/content/question';
import Collect from '../containers/userspace/content/collect';
import Follow from '../containers/userspace/content/follow';
import Home from '../containers/userspace/home';
import System from '../containers/userspace/inbox/system';

export default (
  <Route path="userspace" component={Userspace}>
    <IndexRedirect to="home" />
    <Route path="home">
      <IndexRoute component={Home} />
    </Route>
    <Route path="content">
      <IndexRedirect to="article" />
      <Route path="article" component={Article} />
      <Route path="question" component={Question} />
      <Route path="collect" component={Collect} />
      <Route path="follow" component={Follow} />
    </Route>
    <Route path="message">
      <IndexRedirect to="system" />
      <Route path="system" component={System} />
    </Route>
  </Route>
);
