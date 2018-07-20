import React, { Component } from 'react';
import Divider from 'components/divider';
import { Table, Input, Radio, Button, Modal, message } from 'antd';
import utils from 'lib/utils';
import moment from 'moment';
import { ADMIN_POST_SYSTEM_MESSAGE, ADMIN_GET_SYSTEM_MESSAGE_LIST, ADMIN_DELETE_SYSTEM_MESSAGE } from 'constants/url';
import './message.scss';

const { TextArea } = Input;
const { Group } = Radio;

export default class MessageManage extends Component {
  constructor() {
    super();
    this.state = {
      target: 'all',
      targetValue: '',
      contentValue: '',
      messageList: []
    };
    utils.bindMethods(['changeState', 'deleteMessage', 'onPostMessage'], this);
    moment.locale('zh-cn');
    this.columns = [{
      title: '消息ID',
      dataIndex: 'mid',
      key: 'mid'
    }, {
      title: '消息目标',
      dataIndex: 'target',
      key: 'target'
    }, {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      render: text => <div className="list-item-content">{text}</div>
    }, {
      title: '发布时间',
      dataIndex: 'time',
      key: 'time',
      render: time => <span>{moment(+time).format('YYYY-MM-DD')}</span>
    }, {
      title: '操作',
      key: 'options',
      render: (text, record) => (
        <a className="delete" onClick={() => this.deleteMessage(record.mid)}>删除</a>
      )
    }];
  }

  componentDidMount() {
    this.getMessageList();
  }

  onPostMessage() {
    Modal.confirm({
      title: '确认发布消息吗',
      onOk: () => {
        const { targetValue, contentValue } = this.state;
        utils.fetch(ADMIN_POST_SYSTEM_MESSAGE, {
          method: 'POST',
          data: {
            target: targetValue || 'all',
            content: contentValue,
            time: Date.now().toString()
          }
        }).then((res) => {
          if(res.type === 0) {
            message.success('发布消息成功！');
            setTimeout(() => window.location.reload(), 500);
          } else {
            message.error(res.data.msg || '发布消息失败！');
          }
        }, () => {
          message.error('系统出现了点问题, 发布消息失败');
        });
      }
    });
  }

  getMessageList() {
    utils.fetch(ADMIN_GET_SYSTEM_MESSAGE_LIST, {}).then((res) => {
      if(res.type === 0) {
        this.setState({
          messageList: res.data
        });
      } else {
        message.error('获取列表失败');
      }
    }, () => {
      message.error('系统出现了点问题, 获取列表失败');
    });
  }

  deleteMessage(mid) {
    Modal.confirm({
      title: '确认删除该消息吗？',
      onOk: () => {
        utils.fetch(ADMIN_DELETE_SYSTEM_MESSAGE, {
          method: 'POST',
          data: {
            mid
          }
        }).then((res) => {
          if(res.type === 0) {
            message.success('删除成功');
            let { messageList } = this.state;
            messageList = messageList.filter(item => item.mid !== mid);
            this.setState({ messageList });
          } else {
            message.error('删除失败');
          }
        }, () => {
          message.error('系统错误, 删除失败');
        });
      }
    });
  }

  changeState(state) {
    return (e) => {
      if(e.target.value.length >= 500) {
        return;
      }
      this.setState({
        [`${state}`]: e.target.value
      });
    };
  }

  render() {
    const { target, targetValue, contentValue, messageList } = this.state;
    const isSpecialTarget = target === 'target';
    return (
      <div className="message-container">
        <div className="system-message-container">
          <Divider>系统消息管理</Divider>
          <div className="system-message-options">
            <h3 className="title">发送新消息</h3>
            <div className="target">
              <Group
                onChange={this.changeState('target')}
                value={target}
              >
                <Radio value="all">所有用户</Radio>
                <Radio value="target">指定用户</Radio>
              </Group>
            </div>
            {isSpecialTarget &&
              <div className="input-area">
                <p>指定用户ID：</p>
                <Input
                  onChange={this.changeState('targetValue')}
                  value={targetValue}
                  placeholder="请输入要发送消息的用户ID"
                />
              </div>
            }
          </div>
          <div className="message-content">
            <p>消息内容：</p>
            <TextArea
              onChange={this.changeState('contentValue')}
              value={contentValue}
              placeholder="请谨慎填写消息内容..."
              className="content-textarea"
            />
          </div>
          <div className="button-area">
            <Button className="post-btn" type="primary" onClick={this.onPostMessage}>发布消息</Button>
          </div>
          <div className="system-message-list">
            <h3 className="title">消息列表</h3>
            <Table
              columns={this.columns}
              dataSource={messageList}
              rowKey={record => record.mid}
            />
          </div>
        </div>
      </div>
    );
  }
}
