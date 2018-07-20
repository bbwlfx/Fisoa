import React, { Component } from 'react';
import { message } from 'antd';
import TabHead from './tab-head';
import AuthoList from '../../../components/autho-list';
import utils from '../../../lib/utils';
import strings from '../../../strings';
import { GET_ATTENTION_LIST, DELETE_ATTENTION } from '../../../constants/url';
import '../../../../scss/userspace-follow.scss';

const info = window.userInfo;

class Follow extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
    utils.bindMethods(['unfollowAction'], this);
  }
  componentDidMount() {
    this.getAttentionList();
    utils.logEvent('PV_Userprofile_Follow');
  }
  getAttentionList() {
    utils.fetch(GET_ATTENTION_LIST, {
      data: {
        uid: info.uid
      }
    }).then((res) => {
      if(res.type === 0) {
        this.setState({
          data: res.data
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  unfollowAction(atid) {
    utils.fetch(DELETE_ATTENTION, {
      method: 'POST',
      data: {
        atid
      }
    }).then((res) => {
      if(res.type === 0) {
        utils.logEvent('Unfollow_User');
        const data = this.state.data.filter(item => item.uid !== atid);
        this.setState({
          data
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  render() {
    const { data } = this.state;
    const hasData = data.length !== 0;
    return (
      <div className="like-container">
        <TabHead curTab={TabHead.Follow} />
        {hasData && <AuthoList
          data={data}
          unfollowAction={this.unfollowAction}
        />}
        {!hasData &&
          <div className="no-data card-container">
            {strings.user_no_attention_self}
          </div>}
      </div>
    );
  }
}
export default Follow;
