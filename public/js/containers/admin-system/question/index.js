import React, { Component } from 'react';
import Divider from 'components/divider';
import { Input, Modal, Table } from 'antd';
import moment from 'moment';
import utils from 'lib/utils';
import { ADMIN_GET_QUESTION_INFO, DELETE_QUESTION } from 'constants/url';
import './question.scss';

const { Search } = Input;

export default class ArticleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      questionInfo: [],
      showDetail: false
    };
    utils.bindMethods(['handleSearch', 'handleChange', 'deleteArticle'], this);
    moment.locale('zh-cn');
    this.columns = [{
      title: '问题ID',
      dataIndex: 'qid',
      key: 'qid'
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '发布时间',
      dataIndex: 'time',
      key: 'time',
      render: text => <span>{moment(+text).format('YYYY-MM-DD')}</span>
    }, {
      title: '问题链接',
      dataIndex: 'qid',
      key: 'href',
      render: (text, record) => <a target="_blank" href={`/question/${text}`} className="link">{record.title}</a>
    }, {
      title: '操作',
      dataIndex: 'qid',
      key: 'options',
      render: qid => (
        <div className="options">
          <a className="delete" onClick={() => this.deleteArticle(qid)}>删除</a>
        </div>
      )
    }];
  }

  deleteArticle(qid) {
    Modal.confirm({
      title: '确认删除问题',
      onOk: () => {
        utils.fetch(DELETE_QUESTION, {
          method: 'POST',
          data: {
            qid
          }
        }).then((res) => {
          if(res.type === 0) {
            this.setState({
              questionInfo: []
            });
            Modal.success({
              title: '删除成功'
            });
          } else {
            Modal.error({
              title: '删除失败'
            });
          }
        }, () => {
          Modal.error({
            title: '错误',
            content: '服务器出了一些问题，暂时无法访问数据'
          });
        });
      }
    });
  }

  handleSearch() {
    const { searchValue } = this.state;
    utils.fetch(ADMIN_GET_QUESTION_INFO, {
      method: 'GET',
      data: {
        qid: searchValue
      }
    }).then((res) => {
      this.setState({
        showDetail: true,
        questionInfo: res.data
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

  render() {
    const { searchValue, questionInfo, showDetail } = this.state;

    return (
      <div className="question-controller-container">
        <div className="search-area">
          <Divider>问题查询</Divider>
          <div className="search-body">
            <span className="text">问题ID：</span>
            <Search
              placeholder="输入问题ID"
              className="search-input"
              value={searchValue}
              onChange={this.handleChange}
              onSearch={this.handleSearch}
            />
          </div>
        </div>
        {showDetail &&
          <div className="user-detail-area">
            <Divider>问题信息</Divider>
            <div className="user-detail-body">
              <Table
                columns={this.columns}
                dataSource={questionInfo}
                rowKey={record => record.qid}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}
