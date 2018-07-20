import React, { Component } from 'react';
import Divider from 'components/divider';
import { GET_USER_INFO, ADMIN_CHANGE_STATUS, ADMIN_BAN_ACCOUNT, ADMIN_DELETE_BANNED_RECORD } from 'constants/url';
import { Input, Modal, Col, Button } from 'antd';
import USERINFO, { accountStatus, accountController } from 'constants/userInfo';
import utils from 'lib/utils';
import './user.scss';

const { Search, TextArea } = Input;

const changeStatus = (uid, status = 1) => {
  Modal.confirm({
    title: '确认要改变账号状态吗？',
    onOk: () => {
      utils.fetch(ADMIN_CHANGE_STATUS, {
        data: {
          uid,
          status
        }
      }).then((res) => {
        if(res.type !== 0) {
          Modal.error({
            title: '操作失败',
            content: '请确认数据后重试'
          });
        }
        Modal.success({
          title: '操作成功，用户状态已改变',
          onOk: () => window.location.reload()
        });
      }, () => {
        Modal.error({
          title: '错误',
          content: '服务器出了一些问题，暂时无法访问数据'
        });
      });
    }
  });
};

const unblockAccount = (uid) => {
  Modal.confirm({
    title: '解封',
    content: '是否确认解封该账户？',
    onOk: () => {
      utils.fetch(ADMIN_DELETE_BANNED_RECORD, {
        data: {
          uid
        }
      }).then((res) => {
        if(res.type !== 0) {
          Modal.error({
            title: '解封失败',
            content: '请稍后重试'
          });
        }
        Modal.success({
          title: '解封成功！',
          onOk: () => window.location.reload()
        });
      }, () => {
        Modal.error({
          title: '错误',
          content: '服务器出了一些问题，暂时无法访问数据'
        });
      });
    }
  });
};

export default class UserManage extends Component {
  constructor() {
    super();
    this.state = {
      searchValue: '',
      showDetail: false,
      userInfo: null,
      reason: '不符合发文规范'
    };
    utils.bindMethods(['handleSearch', 'handleChange', 'renderController'], this);
  }
  handleSearch() {
    const { searchValue } = this.state;
    utils.fetch(GET_USER_INFO, {
      data: {
        uid: searchValue
      }
    }).then((res) => {
      if(res.type === 0) {
        this.setState({
          userInfo: res.data
        });
      }
      this.setState({
        showDetail: true
      });
    }, () => {
      this.setState({
        showDetail: true
      });
      Modal.error({
        title: '错误',
        content: '服务器出了一些问题，暂时无法访问数据'
      });
    });
  }
  handleChange(e) {
    this.setState({
      searchValue: e.target.value
    });
  }

  handleBanAction(uid) {
    Modal.confirm({
      title: '确认要封禁账号吗？',
      content: <div className="banned-modal">
        <p>请输入封禁原因(不超过255字)</p>
        <TextArea
          maxLength={255}
          defaultValue="不符合发文规范"
          onChange={(e) => { this.setState({ reason: e.target.value }); }}
        />
      </div>,
      onOk: () => {
        utils.fetch(ADMIN_BAN_ACCOUNT, {
          method: 'POST',
          data: {
            uid,
            reason: this.state.reason
          }
        }).then((res) => {
          if(res.type !== 0) {
            Modal.error({
              title: '操作失败',
              content: '请确认数据后重试'
            });
          }
          Modal.success({
            title: '操作成功，账号已封禁，请注意及时解封',
            onOk: () => window.location.reload()
          });
        }, () => {
          Modal.error({
            title: '错误',
            content: '服务器出了一些问题，暂时无法访问数据'
          });
        });
      }
    });
  }

  renderUserInfo() {
    const { userInfo } = this.state;
    const ret = [];
    if(!userInfo) {
      return <div className="not-exist-text">用户不存在，请检查查询的用户ID填写是否正确</div>;
    }
    Object.keys(userInfo).forEach((item, index) => {
      ret.push(<Col className="flex" span={12} key={index}>
        <span className="flex-text">{USERINFO[item] || item}：</span>
        <span className="flex-value">{
          item === 'status' ? accountStatus[userInfo[item]] : userInfo[item] || '暂无信息'
        }
        </span></Col>);
    });
    return ret;
  }

  renderController() {
    const { userInfo } = this.state;
    const ret = [];
    if(!userInfo) {
      return <div className="not-exist-text">用户不存在，请检查查询的用户ID填写是否正确</div>;
    }
    const controller = accountController[userInfo.status];
    controller.forEach((item, index) => {
      let func = null;
      if(userInfo.status === 0) {
        func = () => unblockAccount(userInfo.uid);
      } else {
        func = item.targetStatus === '0' ?
          () => this.handleBanAction(userInfo.uid) :
          () => changeStatus(userInfo.uid, item.targetStatus);
      }
      ret.push(<Button
        key={index}
        onClick={func}
        type="primary"
        style={{
          marginRight: '20px'
        }}
      >{item.text}</Button>);
    });
    return ret;
  }
  render() {
    const { searchValue, showDetail } = this.state;
    return (
      <div className="user-container">
        <div className="search-area">
          <Divider>用户查询</Divider>
          <div className="search-body">
            <span className="text">用户ID：</span>
            <Search
              placeholder="输入用户ID"
              className="search-input"
              value={searchValue}
              onChange={this.handleChange}
              onSearch={this.handleSearch}
            />
          </div>
        </div>
        {showDetail &&
          <div className="user-detail-area">
            <Divider>用户信息</Divider>
            <div className="user-detail-body">
              {this.renderUserInfo()}
            </div>
          </div>
        }
        {showDetail &&
          <div className="user-controller">
            <Divider>用户管理</Divider>
            <div className="user-controller-body">
              {this.renderController()}
            </div>
          </div>
        }
      </div>
    );
  }
}
