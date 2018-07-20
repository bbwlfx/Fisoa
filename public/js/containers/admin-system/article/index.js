import React, { Component } from 'react';
import Divider from 'components/divider';
import { Input, Modal, Table } from 'antd';
import moment from 'moment';
import utils from 'lib/utils';
import { ADMIN_GET_ARTICLE_INFO, DELETE_ARTICLE } from 'constants/url';
import './article.scss';

const { Search } = Input;

export default class ArticleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      articleInfo: [],
      showDetail: false
    };
    utils.bindMethods(['handleSearch', 'handleChange', 'deleteArticle'], this);
    moment.locale('zh-cn');
    this.columns = [{
      title: '文章ID',
      dataIndex: 'aid',
      key: 'aid'
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
      title: '文章链接',
      dataIndex: 'aid',
      key: 'href',
      render: (text, record) => <a target="_blank" href={`/article/${text}`} className="link">{record.title}</a>
    }, {
      title: '操作',
      dataIndex: 'aid',
      key: 'options',
      render: aid => (
        <div className="options">
          <a className="delete" onClick={() => this.deleteArticle(aid)}>删除</a>
        </div>
      )
    }];
  }

  deleteArticle(aid) {
    Modal.confirm({
      title: '确认删除文章',
      onOk: () => {
        utils.fetch(DELETE_ARTICLE, {
          method: 'GET',
          data: {
            aid
          }
        }).then((res) => {
          if(res.type === 0) {
            Modal.success({
              title: '删除成功'
            });
            this.setState({
              articleInfo: []
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
    utils.fetch(ADMIN_GET_ARTICLE_INFO, {
      method: 'GET',
      data: {
        aid: searchValue
      }
    }).then((res) => {
      this.setState({
        showDetail: true,
        articleInfo: res.data
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
    const { searchValue, articleInfo, showDetail } = this.state;
    return (
      <div className="article-controller-container">
        <div className="search-area">
          <Divider>文章查询</Divider>
          <div className="search-body">
            <span className="text">文章ID：</span>
            <Search
              placeholder="输入文章ID"
              className="search-input"
              value={searchValue}
              onChange={this.handleChange}
              onSearch={this.handleSearch}
            />
          </div>
        </div>
        {showDetail &&
          <div className="user-detail-area">
            <Divider>文章信息</Divider>
            <div className="user-detail-body">
              <Table
                columns={this.columns}
                dataSource={articleInfo}
                rowKey={record => record.aid}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}
