import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import TabList from '../../../components/tab-list';

const System = 'System';

const tabs = [{
  key: System,
  value: <Link to="/userspace/message/system">系统消息</Link>
}];

export default class TabHead extends Component {
  render() {
    const { curTab } = this.props;
    return (
      <TabList tabs={tabs} curTab={curTab} className="card-container" />
    );
  }
}

TabHead.propTypes = {
  curTab: PropTypes.string
};
TabHead.defaultProps = {
  curTab: System
};
TabHead.System = System;
