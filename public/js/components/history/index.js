import React, { Component } from 'react';
import history from 'lib/history';
import strings from 'strings';
import './history.scss';

export default class History extends Component {
  render() {
    const list = history.getHistory(window.userInfo.uid);
    const hasData = list.length > 0;
    return (
      <ul className="history-list">
        {!hasData && <div className="no-data">{strings.nav_no_history}</div>}
        {hasData && list.map((item, index) => <li className="history-item" key={index}><a href={item.href} target="_blank">{item.title}</a></li>)}
      </ul>
    );
  }
}
