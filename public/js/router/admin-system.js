import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import UserManage from 'containers/admin-system/user';
import MessageManage from 'containers/admin-system/message';
import BulletinManage from 'containers/admin-system/bulletin';
import ArticleManage from 'containers/admin-system/article';
import QuestionManage from 'containers/admin-system/question';
import FeedbackManage from 'containers/admin-system/feedback';
import ForbidManage from 'containers/admin-system/forbid';
import Admin from 'containers/admin-system';

export default (
  <Route path="admin-system" component={Admin}>
    <IndexRedirect to="user" />
    <Route path="user" component={UserManage} />
    <Route path="bulletin" component={BulletinManage} />
    <Route path="message" component={MessageManage} />
    <Route path="article" component={ArticleManage} />
    <Route path="question" component={QuestionManage} />
    <Route path="feedback" component={FeedbackManage} />
    <Route path="forbid" component={ForbidManage} />
  </Route>
);
