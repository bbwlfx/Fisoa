import React, { Component } from 'react';
import Divider from 'components/divider';
import { message, Table, Tooltip, Icon } from 'antd';
import { ADMIN_GET_FEEDBACK_LIST } from 'constants/url';
import utils from 'lib/utils';
import './feedback.scss';

const columns = [{
  title: <span>用户ID&nbsp;<Tooltip title="0代表未登录用户"><Icon type="question-circle-o" /></Tooltip></span>,
  dataIndex: 'uid',
  key: 'uid'
}, {
  title: '反馈内容',
  dataIndex: 'content',
  key: 'content'
}];

export default class FeedbackManage extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    utils.fetch(ADMIN_GET_FEEDBACK_LIST, {}).then((res) => {
      if(res.type === 0) {
        this.setState({
          data: res.data.reverse()
        });
      } else {
        message.error(res.data.msg || '发布消息失败！');
      }
    }, () => {
      message.error('系统出现了点问题, 获取用户反馈失败');
    });
  }
  render() {
    const { data } = this.state;
    return (
      <div className="feedback-container">
        <Divider>用户反馈管理</Divider>
        <Table
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  }
}
