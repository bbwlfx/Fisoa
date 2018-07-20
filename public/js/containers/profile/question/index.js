import React, { Component } from 'react';
import { message } from 'antd';
import TabHead from '../tabHead';
import { GET_QUESTION } from '../../../constants/url';
import FeedWrap from '../../../components/feed-wrap';
import QAList from '../../../components/QA-list';
import utils from '../../../lib/utils';
import strings from '../../../strings';

const SHOW_COUNT = 10;
const info = window.profileInfo;

export default class Question extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      count: 0,
      hasMore: true
    };
    utils.bindMethods(['getQuestion'], this);
  }
  getQuestion() {
    const { count } = this.state;
    return utils.fetch(GET_QUESTION, {
      method: 'GET',
      data: {
        count,
        show_num: SHOW_COUNT,
        uid: info.uid
      }
    }).then((res) => {
      if(res.type === 0) {
        this.setState({
          hasMore: res.data.has_more,
          data: res.data.question
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  render() {
    const { data, hasMore } = this.state;
    const hasData = data.length !== 0;
    return (
      <FeedWrap
        className="profile-container"
        hasMore={hasMore}
        loadData={this.getQuestion}
      >
        <TabHead curTab={TabHead.Question} />
        {hasData && <QAList
          data={data}
          showControll={false}
        />}
        {!hasData &&
          <div className="no-data card-container">{strings.question_no_data}</div>
        }
      </FeedWrap>
    );
  }
}
