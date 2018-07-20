import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Nav from 'containers/nav';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';
import './scss/admin-system.scss';

const { Item } = Menu;
const menuList = [{
  key: 'user',
  value: '用户管理',
  icon: 'user'
}, {
  key: 'article',
  value: '文章管理',
  icon: 'pie-chart'
}, {
  key: 'question',
  value: '问答管理',
  icon: 'code'
}, {
  key: 'bulletin',
  value: '公告管理',
  icon: 'laptop'
}, {
  key: 'message',
  value: '消息管理',
  icon: 'inbox'
}, {
  key: 'feedback',
  value: '用户反馈',
  icon: 'smile-o'
}, {
  key: 'forbid',
  value: '封禁管理',
  icon: 'compass'
}];
export default class Admin extends Component {
  constructor(props) {
    super(props);
    const defaultKey = window.location.href.match(/\/(\w+)$/)[1];
    this.state = {
      defaultKey: [defaultKey]
    };
  }
  render() {
    const { children } = this.props;
    const { defaultKey } = this.state;
    return (
      <div className="admin-container">
        <Nav userInfo={window.userInfo} showBackTop={false} />
        <div className="admin-body">
          <div className="menu-wrapper">
            <Menu
              defaultSelectedKeys={defaultKey}
              mode="inline"
            >
              {
                menuList.map(item => (
                  <Item key={item.key}>
                    <Link to={`/admin-system/${item.key}`}>
                      {item.icon && <Icon type={item.icon} />}
                      <span>{item.value}</span>
                    </Link>
                  </Item>
                ))
              }
            </Menu>
          </div>
          <div className="main-content">{children}</div>
        </div>
      </div>
    );
  }
}
Admin.defaultProps = {
  children: null
};
Admin.propTypes = {
  children: PropTypes.any
};
