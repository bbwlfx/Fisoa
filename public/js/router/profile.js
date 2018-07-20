import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Profile from '../containers/profile';
import Article from '../containers/profile/article';
import Question from '../containers/profile/question';

export default (
  <Route path="profile/:id" component={Profile}>
    <IndexRedirect to="article" />
    <Route path="article" component={Article} />
    <Route path="question" component={Question} />
  </Route>
);
