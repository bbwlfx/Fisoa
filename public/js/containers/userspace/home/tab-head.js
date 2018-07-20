import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import TabList from '../../../components/tab-list';

const Home = 'Home';

const tabs = [{
  key: Home,
  value: <Link to="/userspace/home">公告板</Link>
}];

export default class TabHead extends Component {
  render() {
    const { curTab } = this.props;
    return (
      <TabList tabs={tabs} curTab={curTab} className="card-container" />
    );
  }
}
TabHead.Home = Home;

TabHead.propTypes = {
  curTab: PropTypes.string
};
TabHead.defaultProps = {
  curTab: Home
};
