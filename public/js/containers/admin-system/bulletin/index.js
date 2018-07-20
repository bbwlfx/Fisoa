import React, { Component } from 'react';
import Divider from 'components/divider';
import { Table, message, Button, Input, Modal } from 'antd';
import { ADMIN_GET_BULLETIN, ADMIN_POST_BULLETIN, ADMIN_DELETE_BULLETIN } from 'constants/url';
import utils from 'lib/utils';
import moment from 'moment';
import strings from '../../../strings';
import './bulletin.scss';

export default class BulletinManage extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '公告ID',
      key: 'bid',
      dataIndex: 'bid'
    }, {
      title: '公告名称',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => <a target="_blank" href={`/article/${record.aid}`} className="link">{title}</a>
    }, {
      title: '发布人',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => <span>{`${name}(${record.uid})`}</span>
    }, {
      title: '发布时间',
      dataIndex: 'time',
      key: 'time',
      render: time => <span>{moment(+time).format('YYYY-MM-DD')}</span>
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render: (text, record) => (<div><a className="delete" onClick={() => this.deleteBulletin(record.bid)}>删除</a></div>)
    }];

    this.state = {
      bulletinList: [],
      id: ''
    };
    moment.locales('zh-cn');
    utils.bindMethods(['handleInputChange', 'postBulletin', 'deleteBulletin'], this);
  }

  componentDidMount() {
    this.getBulletinList();
  }

  deleteBulletin(bid) {
    Modal.confirm({
      title: '确认删除此条记录',
      onOk: () => {
        utils.fetch(ADMIN_DELETE_BULLETIN, {
          method: 'POST',
          data: {
            bid
          }
        }).then((res) => {
          if(res.type === 0) {
            message.success('删除成功');
            const { bulletinList } = this.state;
            const filterList = bulletinList.filter(item => item.bid !== bid);
            this.setState({
              bulletinList: filterList
            });
          } else {
            Modal.error({
              title: '删除失败'
            });
          }
        }, () => {
          Modal.error({
            title: '删除失败'
          });
        });
      }
    });
  }

  getBulletinList() {
    utils.fetch(ADMIN_GET_BULLETIN, {}).then((res) => {
      if(res.type === 0) {
        this.setState({
          bulletinList: res.data
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }

  handleInputChange(e) {
    const id = e.target.value;
    this.setState({
      id
    });
  }

  postBulletin() {
    Modal.confirm({
      title: '确认发布公告吗',
      onOk: () => {
        const { id } = this.state;
        const time = Date.now();
        utils.fetch(ADMIN_POST_BULLETIN, {
          method: 'POST',
          data: {
            time,
            aid: id
          }
        }).then((res) => {
          this.setState({ id: '' });
          if(res.type === 0) {
            Modal.success({
              title: '发布成功',
              onOk: () => {
                window.location.reload();
              }
            });
          } else {
            Modal.error({
              title: '发布失败'
            });
          }
        }, () => {
          Modal.error({
            title: '发布失败'
          });
          this.setState({ id: '' });
        });
      }
    });
  }

  render() {
    const { bulletinList, id } = this.state;
    return (
      <div className="bulletin-controller-container">
        <div className="options-wrapper">
          <Divider>操作面板</Divider>
          <div className="options-body">
            <div className="options">
              <Input
                className="id-input"
                placeholder="请输入要发布的公告文章ID"
                onChange={this.handleInputChange}
                value={id}
              />
              <Button type="primary" onClick={this.postBulletin}>发布公告</Button>
            </div>
          </div>
        </div>
        <div className="bulletin-list">
          <Divider>公告列表</Divider>
          <Table
            className="bulletin-list"
            columns={this.columns}
            dataSource={bulletinList}
            rowKey={record => record.bid}
          />
        </div>
      </div>
    );
  }
}
