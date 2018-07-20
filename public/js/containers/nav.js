import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, message } from 'antd';
import Signin from 'components/signin/';
import utils from 'lib/utils';
import BackTop from 'components/backTop';
import PostCard from 'components/post-card';
import Img from 'components/img';
import { EXIT, READ_MESSAGE, HAS_UNREAD_MESSAGE } from 'constants/url';
import strings from 'strings';
import { DEFAULT_AVATAR } from 'constants/default';
import Dynamic from 'components/dynamic';
import History from 'components/history';
import '../../scss/nav.scss';

const openSignin = () => {
  Signin.show();
};

const userExit = () => {
  utils.logEvent('Click_User_Exist');
  utils.fetch(EXIT, {
    method: 'POST',
    data: {}
  }).then((res) => {
    if(res.type === 0) {
      window.location.reload();
      utils.logEvent('User_Exist_Success');
    } else {
      utils.logEvent('User_Exist_Fail');
      message.error(res.data.message || strings.common_server_error);
    }
  }, () => {
    utils.logEvent('User_Exist_Fail_Server_Error');
    message.error(strings.common_server_error);
  });
};

export default class Nav extends Component {
  constructor() {
    super();
    utils.bindMethods(['getPopoverContent',
      'postReadMessage', 'removeNewRecord'], this);
    this.state = {
      hasNewMessage: false,
      hasNewRecord: false
    };
  }
  componentDidMount() {
    if(!this.props.userInfo.hasLogin) {
      return;
    }
    utils.fetch(HAS_UNREAD_MESSAGE, {}).then((res) => {
      if(res.type === 0) {
        this.setState({
          hasNewMessage: !!res.data.unread,
          hasNewRecord: !!res.data.new_record
        });
      }
    }, () => {});
  }
  removeNewRecord() {
    this.setState({
      hasNewRecord: false
    });
  }
  getPopoverContent(type) {
    let html = null;
    switch(type) {
      case 'dynamic':
        html = (
          <div className="dynamic-container">
            <Dynamic />
          </div>
        );
        break;
      case 'history':
        html = (
          <div className="history-container">
            <History />
          </div>
        );
        break;
      case 'user':
        html = (
          <ul className="popover-post">
            <li>
              <a href="/userspace">
                <Icon type="skin" />
                <span>{strings.nav_userspace}</span>
              </a>
            </li>
            <li>
              <a href="/user/setting">
                <Icon type="setting" />
                <span>{strings.nav_setting}</span>
              </a>
            </li>
            {
              this.props.userInfo.status === 5 &&
              <li>
                <a href="/admin-system">
                  <Icon type="safety" />
                  <span>{strings.admin_enter}</span>
                </a>
              </li>
            }
            <li>
              <a href="#" onClick={userExit}>
                <Icon type="edit" />
                <span>{strings.nav_exist}</span>
              </a>
            </li>
          </ul>
        );
        break;
      default:
        break;
    }
    return html;
  }
  postReadMessage() {
    if(!this.state.hasNewMessage) {
      return;
    }
    utils.fetch(READ_MESSAGE, {
      method: 'POST',
      data: {}
    }).then((res) => {
      if(res.type === 0) {
        this.setState({
          hasNewMessage: false
        });
      }
    }, () => {});
  }

  getMiddleContent() {
    const { middleComponent } = this.props;
    if(middleComponent) {
      return middleComponent;
    }
    return <PostCard />;
  }

  render() {
    const { userInfo, showBackTop } = this.props;
    const { hasLogin, avatar } = userInfo;
    return (
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-logo">
            <a href="/">Fisoa</a>
          </div>
          <div className="nav-user-space">
            {hasLogin &&
              <div className="user-content">
                {this.getMiddleContent()}
                <Popover trigger="click" placement="bottom" content={this.getPopoverContent('user')}>
                  <div className="user-avatar">
                    <Img src={avatar || DEFAULT_AVATAR} />
                  </div>
                </Popover>
                <Popover trigger="click" placement="bottom" content={this.getPopoverContent('dynamic')}>
                  <div className="dynamic">
                    <a
                      className={this.state.hasNewRecord ? 'red-point' : ''}
                      onClick={this.removeNewRecord}
                    >
                      <Icon type="notification" />
                      <span>{strings.nav_dynamic}</span>
                    </a>
                  </div>
                </Popover>
                <Popover trigger="click" placement="bottom" content={this.getPopoverContent('history')}>
                  <div className="history">
                    <a>
                      <Icon type="book" />
                      <span>{strings.nav_history}</span>
                    </a>
                  </div>
                </Popover>
                <div className="message">
                  <a
                    href="/userspace/message"
                    onClick={this.postReadMessage}
                    className={this.state.hasNewMessage ? 'red-point' : ''}
                  >
                    <Icon type="bell" />
                    <span>{strings.nav_message}</span>
                  </a>
                </div>
              </div>}
            {!hasLogin &&
              <div className="login-area">
                <a onClick={openSignin}>{strings.nav_sign}</a>
              </div>}
          </div>
        </div>
        {showBackTop && <BackTop />}
      </div>
    );
  }
}

Nav.defaultProps = {
  userInfo: window.userInfo,
  showBackTop: true,
  middleComponent: null
};
Nav.propTypes = {
  userInfo: PropTypes.object,
  showBackTop: PropTypes.bool,
  middleComponent: PropTypes.element
};

