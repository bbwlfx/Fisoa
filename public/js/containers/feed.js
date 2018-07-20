import React, { Component } from 'react';
import { Icon, message } from 'antd';
import FeedList from '../components/feed-list';
import TabList from '../components/tab-list';
import strings from '../strings';
import utils from '../lib/utils';
import { GET_FEED_LIST } from '../constants/url';
import FeedWrap from '../components/feed-wrap';
import feedType from '../constants/feed';

const show_num = 10;
const tabs = [{
  key: feedType.Article,
  value: <a><Icon type="file-text" />&nbsp;{strings.feed_article}</a>
}, {
  key: feedType.Question,
  value: <a><Icon type="question-circle-o" />&nbsp;{strings.feed_question}</a>
}];
class Feed extends Component {
  constructor() {
    super();
    this.state = {
      tab: feedType.Article,
      count: {
        [feedType.Article]: 0,
        [feedType.Question]: 0
      },
      has_more: {
        [feedType.Article]: true,
        [feedType.Question]: true
      }
    };
    this.feedData = {};
    utils.bindMethods(['changeTab', 'getFeedList'], this);
  }
  componentDidMount() {
    utils.logEvent('PV_Feed');
  }
  getFeedList() {
    utils.logEvent('GET_Feed_Start');
    const { count, tab, has_more } = this.state;
    return utils.fetch(GET_FEED_LIST, {
      data: {
        count: count[tab],
        show_num,
        type: tab
      }
    }).then((res) => {
      if(res.type === 0) {
        utils.logEvent('GET_Feed_Success');
        if(this.feedData[tab]) {
          this.feedData[tab] = this.feedData[tab].concat(res.data.feed_list);
        } else {
          this.feedData[tab] = res.data.feed_list;
        }
        const newCount = Object.assign({}, count, {
          [`${tab}`]: count[tab] + 1
        });
        const newHasMore = Object.assign({}, has_more, {
          [`${tab}`]: res.data.has_more
        });
        this.setState({
          has_more: newHasMore,
          count: newCount
        });
      } else {
        utils.logEvent('GET_Feed_Fail');
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      utils.logEvent('GET_Feed_Fail_Server_Error');
      message.error(strings.common_server_error);
    });
  }
  changeTab(tab) {
    this.setState({
      tab
    }, () => {
      this.getFeedList();
    });
  }
  render() {
    const { tab, has_more } = this.state;
    const data = this.feedData[tab] || [];
    return (
      <FeedWrap
        className="feed-container card-container"
        hasMore={has_more[tab]}
        loadData={this.getFeedList}
        isShowNoMoreText
      >
        <TabList tabs={tabs} curTab={tab} onTabClick={this.changeTab} />
        <FeedList
          data={data}
        />
      </FeedWrap>
    );
  }
}

export default Feed;
