import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import TabList from '../../../components/tab-list';

const Article = 'Article';
const Question = 'Question';
const Collect = 'Collect';
const Follow = 'Follow';

const tabs = [
  {
    key: Article,
    value: <Link to="/userspace/content/article">发表文章</Link>
  }, {
    key: Question,
    value: <Link to="/userspace/content/question">发表提问</Link>
  }, {
    key: Collect,
    value: <Link to="/userspace/content/collect">收藏文章</Link>
  }, {
    key: Follow,
    value: <Link to="/userspace/content/follow">关注列表</Link>
  }
];
export default class TabHead extends Component {
  render() {
    return (
      <TabList tabs={tabs} curTab={this.props.curTab} className="card-container" />
    );
  }
}
TabHead.propTypes = {
  curTab: PropTypes.string
};
TabHead.defaultProps = {
  curTab: Article
};
TabHead.Article = Article;
TabHead.Question = Question;
TabHead.Collect = Collect;
TabHead.Follow = Follow;
