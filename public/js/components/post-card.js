import React, { Component } from 'react';
import { Icon, Modal, message } from 'antd';
import Question from './question';
import '../../scss/post-card.scss';
import utils from '../lib/utils';
import strings from '../strings';
import { POST_QUESTION } from '../constants/url';

const MAX_TAGS_LENGTH = 20;

class PostCard extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      tags: '',
      content: ''
    };
    utils.bindMethods(['postQuestion', 'changeTitle', 'changeTags', 'changeContent'], this);
  }
  changeTitle(e) {
    this.setState({
      title: e.target.value.trim()
    });
  }
  changeTags(tags) {
    this.setState({
      tags: tags.trim()
    });
  }
  changeContent(e) {
    this.setState({
      content: e.target.value
    });
  }
  postQuestion() {
    Modal.info({
      content: <Question
        changeTitle={this.changeTitle}
        changeTags={this.changeTags}
        changeContent={this.changeContent}
      />,
      okText: strings.question_post,
      maskClosable: true,
      onOk: () => {
        Modal.confirm({
          content: strings.question_confirm_post,
          okText: strings.common_confirm,
          cancelText: strings.common_cancel,
          onOk: () => {
            const { title, tags, content } = this.state;
            if(tags.length > MAX_TAGS_LENGTH) {
              message.error(strings.question_tags_exceed_limit);
            }
            if(!!title && !!tags && !!content) {
              utils.fetch(POST_QUESTION, {
                method: 'POST',
                data: {
                  title: title.trim(),
                  tags: tags.trim(),
                  content: content.trim(),
                  time: Date.now().toString()
                }
              }).then((res) => {
                if(res.type === 0) {
                  message.success(strings.question_post_success);
                } else {
                  message.error(res.data.msg || strings.question_post_error);
                }
              }, () => {
                message.error(strings.common_server_error);
              });
            } else {
              message.error(strings.question_not_null);
            }
          }
        });
      }
    });
  }
  render() {
    return (
      <div className="post-card-container">
        <ul className="post-list">
          <li>
            <a onClick={this.postQuestion}>
              <Icon type="question-circle-o" />&nbsp;
              <span>{strings.common_post_question}</span>
            </a>
          </li>
          <li>
            <a href="/new/article" className="post-article">
              <Icon type="edit" />&nbsp;
              <span>{strings.common_post_article}</span>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
export default PostCard;
