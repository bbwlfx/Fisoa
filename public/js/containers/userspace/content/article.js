import React, { Component } from 'react';
import { Modal, message } from 'antd';
import FeedWrap from 'components/feed-wrap';
import ArticleList from 'components/article-list';
import utils from 'lib/utils';
import strings from 'strings';
import { DELETE_ARTICLE, GET_ARTICLE } from 'constants/url';
import 'scss/article-item.scss';
import TabHead from './tab-head';

const SHOW_COUNT = 10;

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      count: 0,
      hasMore: true
    };
    utils.bindMethods(['deleteArticle', 'getArticle'], this);
  }
  componentDidMount() {
    utils.logEvent('PV_Userprofile_Article');
  }
  getArticle() {
    const { count } = this.state;
    return utils.fetch(GET_ARTICLE, {
      method: 'GET',
      data: {
        count,
        show_num: SHOW_COUNT,
        uid: window.userInfo.uid
      }
    }).then((res) => {
      if(res.type === 0) {
        const { data } = this.state;
        this.setState({
          count: this.state.count + 1,
          hasMore: res.data.has_more,
          data: data.concat(res.data.items)
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  deleteArticle(aid) {
    const { data } = this.state;
    Modal.confirm({
      title: strings.common_delete,
      content: strings.article_delete_article,
      onOk: () => {
        utils.fetch(DELETE_ARTICLE, {
          method: 'GET',
          data: {
            aid
          }
        }).then((res) => {
          if(res.type === 0) {
            utils.logEvent('Delete_Article');
            this.setState({
              data: data.filter(item => item.aid !== aid)
            });
            message.success(strings.article_delete_success);
          } else {
            message.error(res.data.msg || strings.common_server_error);
          }
        }, () => {
          message.error(strings.common_server_error);
        });
      }
    });
  }
  render() {
    const { data, hasMore } = this.state;
    const hasData = data.length !== 0;
    return (
      <FeedWrap
        className="profile-container"
        hasMore={hasMore}
        loadData={this.getArticle}
      >
        <TabHead curTab={TabHead.Article} />
        {hasData && <ArticleList
          data={data}
          deleteArticle={this.deleteArticle}
        />}
        {!hasData &&
          <div className="no-data card-container">{strings.article_no_data_self}</div>
        }
      </FeedWrap>
    );
  }
}
export default Profile;
