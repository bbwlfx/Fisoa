import React, { Component } from 'react';
import utils from 'lib/utils';
import Divider from 'components/divider';
import { message, Table, Modal } from 'antd';
import { ADMIN_GET_BANNED_LIST, ADMIN_DELETE_BANNED_RECORD } from 'constants/url';
import moment from 'moment';
import './forbid.scss';

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

const columns = [{
  title: '用户ID',
  dataIndex: 'uid',
  key: 'uid'
}, {
  title: '封禁原因',
  dataIndex: 'reason',
  key: 'reason'
}, {
  title: '封禁时间',
  dataIndex: 'time',
  key: 'time',
  render: text => moment(+text).format('YYYY-MM-DD')
}, {
  title: '解封操作',
  key: 'unblock',
  render: (text, record) => <a onClick={() => { unblockAccount(record.uid); }} style={{ color: '#108ee9' }}>解封</a>
}];

export default class ForbidManage extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
    this.fetchData = this.fetchData.bind(this);
    moment.locale('zh-cn');
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    utils.fetch(ADMIN_GET_BANNED_LIST, {}).then((res) => {
      if(res.type === 0) {
        this.setState({
          data: res.data
        });
      } else {
        message.error(res.data.msg || '获取数据失败');
      }
    }, () => {
      message.error('系统出现了点问题, 获取封禁队列失败');
    });
  }
  render() {
    const { data } = this.state;
    return (
      <div className="feedback-container">
        <Divider>用户封禁管理</Divider>
        <Table
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  }
}
