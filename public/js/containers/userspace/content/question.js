import React, { Component } from 'react';
import { Modal, message } from 'antd';
import TabHead from './tab-head';
import FeedWrap from '../../../components/feed-wrap';
import QAList from '../../../components/QA-list';
import utils from '../../../lib/utils';
import strings from '../../../strings';
import { DELETE_QUESTION, GET_QUESTION } from '../../../constants/url';
import '../../../../scss/userspace-question.scss';

const SHOW_COUNT = 10;

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      count: 0,
      hasMore: true
    };
    utils.bindMethods(['deleteQuestion', 'getQuestion'], this);
  }
  componentDidMount() {
    utils.logEvent('PV_Userprofile_Question');
  }
  getQuestion() {
    const { count } = this.state;
    return utils.fetch(GET_QUESTION, {
      method: 'GET',
      data: {
        count,
        show_num: SHOW_COUNT,
        uid: window.userInfo.uid
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
  deleteQuestion(qid) {
    const { data } = this.state;
    Modal.confirm({
      title: strings.common_delete,
      content: strings.question_delete,
      onOk: () => {
        utils.fetch(DELETE_QUESTION, {
          method: 'POST',
          data: {
            qid
          }
        }).then((res) => {
          if(res.type === 0) {
            utils.logEvent('Delete_Question');
            this.setState({
              data: data.filter(item => item.qid !== qid)
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
        loadData={this.getQuestion}
      >
        <TabHead curTab={TabHead.Question} />
        {hasData && <QAList
          data={data}
          deleteQuestion={this.deleteQuestion}
        />}
        {!hasData &&
          <div className="no-data card-container">{strings.question_no_data_self}</div>
        }
      </FeedWrap>
    );
  }
}
export default Profile;
