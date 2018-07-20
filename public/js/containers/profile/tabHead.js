import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import TabList from '../../components/tab-list';
import strings from '../../strings';

const Article = 'Article';
const Question = 'Question';
const info = window.profileInfo;

const tabs = [
  {
    key: Article,
    value: <Link to={`/profile/${info.uid}/article`}>文章</Link>
  }, {
    key: Question,
    value: <Link to={`/profile/${info.uid}/question`}>问题</Link>
  }
];

class TabHead extends Component {
  render() {
    const { fans, follow } = this.props;
    return (
      <div className="tab-head card-container">
        <TabList
          tabs={tabs}
          curTab={this.props.curTab}
        />
        <div className="data-field">
          <span className="fans">{`${strings.common_follow}: ${follow}`}</span>
          <span className="follow">{`${strings.userspace_fans}: ${fans}`}</span>
        </div>
      </div>
    );
  }
}
TabHead.propTypes = {
  curTab: PropTypes.string.isRequired,
  fans: PropTypes.number,
  follow: PropTypes.number
};
TabHead.defaultProps = {
  fans: 0,
  follow: window.profileInfo.attention
};

TabHead.Article = Article;
TabHead.Question = Question;

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(TabHead);
