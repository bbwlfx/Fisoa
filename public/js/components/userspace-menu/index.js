import React, { Component } from 'react';
import { Link } from 'react-router';
import { Icon } from 'antd';
import './scss/menu.scss';

export default class Menu extends Component {
  render() {
    return (
      <div className="menu-container">
        <div className="menu-block">
          <Link to="/userspace/home" className="menu-item-h1" activeClassName="active"><Icon type="home" />主页</Link>
        </div>
        <div className="menu-block">
          <Link to="/userspace/content" className="menu-item-h1" activeClassName="active"><Icon type="appstore" />内容管理</Link>
        </div>
        <div className="menu-block">
          <Link to="/userspace/message" className="menu-item-h1" activeClassName="active"><Icon type="inbox" />消息管理</Link>
        </div>
      </div>
    );
  }
}
