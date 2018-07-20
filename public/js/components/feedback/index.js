import React, { Component } from 'react';
import { message } from 'antd';
import { POST_FEEDBACK } from 'constants/url';
import TextInput from '../text-input';
import utils from '../../lib/utils';
import strings from '../../strings';
import './scss/feedback.scss';

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
    utils.bindMethods(['changeContent', 'doSubmit'], this);
  }
  changeContent(value) {
    this.setState({
      content: value
    });
  }
  doSubmit() {
    const { content } = this.state;
    if(content.trim()) {
      utils.fetch(POST_FEEDBACK, {
        method: 'POST',
        data: {
          content
        }
      }).then((res) => {
        if(res.type === 0) {
          message.success(strings.feedback_post_success);
        } else {
          message.error(res.data.msg || strings.common_server_error);
        }
      }, () => {
        message.error(strings.common_server_error);
      });
    } else {
      message.error(strings.feedback_not_null);
    }
  }
  render() {
    const { content } = this.state;
    return (
      <div className="feedback-container">
        <div className="feedback-body">
          <div className="feedback-content">
            <TextInput
              value={content}
              onChange={this.changeContent}
              maxLength={1000}
              placeholder="输入问题和吐槽..."
            />
          </div>
          <div className="btn-area">
            <div className="submit-btn" onClick={this.doSubmit}>{strings.common_submit}</div>
          </div>
        </div>
      </div>
    );
  }
}
Feedback.propTypes = {};
Feedback.defaultProps = {};
