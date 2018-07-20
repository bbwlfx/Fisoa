import React, { Component } from 'react';
import { message } from 'antd';
import { GET_ARTICLE } from 'constants/url';
import FeedWrap from 'components/feed-wrap';
import ArticleList from 'components/article-list';
import utils from 'lib/utils';
import strings from 'strings';
import 'scss/article-item.scss';
import TabHead from '../tabHead';

const SHOW_COUNT = 10;
const info = window.profileInfo;

export default class Article extends Component {
  constructor() {
    super();
    this.state = {
      hasMore: true,
      data: [],
      count: 0
    };
    utils.bindMethods(['getArticle'], this);
  }
  getArticle() {
    const { count } = this.state;
    return utils.fetch(GET_ARTICLE, {
      method: 'GET',
      data: {
        count,
        show_num: SHOW_COUNT,
        uid: info.uid
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
  render() {
    const { hasMore, data } = this.state;
    const hasData = data.length !== 0;
    return (
      <FeedWrap
        hasMore={hasMore}
        loadData={this.getArticle}
      >
        <TabHead curTab={TabHead.Article} />
        {hasData && <ArticleList
          data={data}
          showControll={false}
          deleteArticle={() => {}}
        />}
        {!hasData &&
          <div className="no-data card-container">{strings.article_no_data}</div>
        }
      </FeedWrap>
    );
  }
}
