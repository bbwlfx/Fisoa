import React, { Component } from 'react';
import utils from 'lib/utils';
import { GET_SYSTEM_MESSAGE } from 'constants/url';
import { message } from 'antd';
import strings from 'strings';
import 'scss/userspace-inbox.scss';
import TabHead from './tab-head';
import MessageItem from './message-item';

const avatar = 'http://imofish.oss-cn-qingdao.aliyuncs.com/1512006922446.jpeg';

const formatList = (list) => {
  list.forEach((item) => {
    Object.assign(item, {
      avatar,
      nickname: 'Fisoa'
    });
  });
};

export default class System extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList: []
    };
  }

  componentDidMount() {
    this.getMessageList();
  }

  getMessageList() {
    utils.fetch(GET_SYSTEM_MESSAGE, {}).then((res) => {
      if(res.type === 0) {
        const { data } = res;
        formatList(data);
        this.setState({
          messageList: data
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  render() {
    const { messageList } = this.state;
    const hasMessage = messageList.length > 0;
    return (
      <div className="system-container">
        <TabHead curTab={TabHead.System} />
        <div className="system-message-content card-container">
          {hasMessage && messageList.map((message, index) => <MessageItem key={index} data={message} />)}
          {!hasMessage && <div className="no-message">{strings.no_message}</div>}
        </div>
      </div>
    );
  }
}

System.defaultProps = {};
System.propTypes = {};
