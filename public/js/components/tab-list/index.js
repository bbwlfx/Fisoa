import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from '../../lib/utils';
import './scss/tab-list.scss';

export default class TabList extends Component {
  render() {
    const {
      className,
      onTabClick,
      tabs,
      curTab
    } = this.props;
    return (
      <div className={utils.className(['tab-list-container', ...className.split(' ')])}>
        <ul className="tab-list">
          {
            tabs.map((tab, index) => (
              <li
                key={index}
                className={utils.className(['tab-item', {
                  active: curTab === tab.key
                }])}
                onClick={() => onTabClick(tab.key)}
              >
                {tab.value}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}
TabList.defaultProps = {
  className: '',
  onTabClick: () => {}
};
TabList.propTypes = {
  curTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tabs: PropTypes.array.isRequired,
  onTabClick: PropTypes.func,
  className: PropTypes.string
};
