import React, { Component } from 'react';
import { Modal, message } from 'antd';
import TabHead from './tab-head';
import FeedWrap from '../../../components/feed-wrap';
import ArticleList from '../../../components/article-list';
import utils from '../../../lib/utils';
import strings from '../../../strings';
import { REMOVE_COLLECT, GET_COLLECT_LIST } from '../../../constants/url';
import '../../../../scss/userspace-article.scss';

const SHOW_COUNT = 10;

class Collect extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      count: 0,
      hasMore: true
    };
    utils.bindMethods(['removeArticle', 'getArticle'], this);
  }
  componentDidMount() {
    utils.logEvent('PV_Userprofile_Collect');
  }
  getArticle() {
    const { count } = this.state;
    return utils.fetch(GET_COLLECT_LIST, {
      method: 'GET',
      data: {
        count,
        show_num: SHOW_COUNT,
        uid: window.userInfo.uid
      }
    }).then((res) => {
      const _state = {};
      if(res.type === 0) {
        const { data } = this.state;
        this.setState({
          count: this.state.count + 1,
          hasMore: res.data.has_more,
          data: data.concat(res.data.collect_list)
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
      this.setState(_state);
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  removeArticle(aid) {
    const { data } = this.state;
    Modal.confirm({
      title: strings.common_delete,
      content: strings.article_remove_collect,
      onOk: () => {
        utils.fetch(REMOVE_COLLECT, {
          method: 'POST',
          data: {
            aid
          }
        }).then((res) => {
          if(res.type === 0) {
            utils.logEvent('Remove_Article');
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
        className="Collect-container"
        hasMore={hasMore}
        loadData={this.getArticle}
      >
        <TabHead curTab={TabHead.Collect} />
        {hasData && <ArticleList
          data={data}
          deleteArticle={this.removeArticle}
        />}
        {!hasData &&
          <div className="no-data card-container">{strings.article_collect_no_data_self}</div>
        }
      </FeedWrap>
    );
  }
}
export default Collect;
