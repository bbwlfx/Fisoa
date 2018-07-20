import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination, Row, message } from 'antd';
import CommentItem from './comment-item';
import TextInput from './text-input';
import utils from '../lib/utils';
import Img from './img';
import { POST_ARTICLE_COMMENT } from '../constants/url';
import strings from '../strings';
import { DEFAULT_AVATAR } from '../constants/default';
import '../../scss/comment.scss';

const SHOW_NUM = 10;
const { userInfo } = window;

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curPage: 1,
      selfComment: '',
      showActions: false,
      data: this.props.data || []
    };
    utils.bindMethods(['onPageChange', 'submitComment',
      'writeComment', 'cancelComment', 'showActions'], this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    });
  }
  onPageChange(curPage) {
    this.setState({ curPage });
  }
  submitComment() {
    const { selfComment } = this.state;
    if(!selfComment) {
      message.error(strings.comment_no_content);
      return;
    }
    utils.fetch(POST_ARTICLE_COMMENT, {
      method: 'POST',
      data: {
        uid: userInfo.uid,
        aid: window.__ARTICLE_INFO__.aid,
        content: selfComment,
        time: Date.now().toString()
      }
    }).then((res) => {
      if(res.type === 0) {
        message.success(strings.article_post_comment_success);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  showActions() {
    this.setState({ showActions: true });
  }
  cancelComment() {
    this.setState({
      showActions: false,
      selfComment: ''
    });
  }
  writeComment(value) {
    this.setState({ selfComment: value });
  }
  render() {
    const { curPage, selfComment, showActions, data } = this.state;
    const total = data.length;
    const showData = data.slice((curPage - 1) * SHOW_NUM, curPage * SHOW_NUM);
    const hasComment = showData.length > 0;
    return (
      <div className="comment-list-container">
        <div className="comment-title">
          <span className="total-num">{utils.formatString(strings.comment_count, total)}</span>
          <span className="line" />
        </div>
        {
          userInfo.hasLogin &&
          <div className="write-container">
            <div className="write-content">
              <div className="avatar">
                <Img src={userInfo.avatar || DEFAULT_AVATAR} />
              </div>
              <TextInput
                className="textarea"
                placeholder={strings.comment_placeholer}
                autosize
                onPressEnter={this.submitComment}
                onChange={this.writeComment}
                maxLength={150}
                value={selfComment}
                onClick={this.showActions}
              />
            </div>
            {
              showActions &&
              <div className="comment-actions">
                <a className="cancel-action" onClick={this.cancelComment}>{strings.common_cancel}</a>
                <a className="submit-action" onClick={this.submitComment}>{strings.common_post}</a>
              </div>
            }
          </div>
        }
        {hasComment && showData.map((item, index) => (
          <CommentItem data={item} key={index} />
        ))}
        {hasComment &&
          <Row type="flex" justify="center">
            <Pagination
              total={total}
              current={curPage}
              pageSize={SHOW_NUM}
              simple
              onChange={this.onPageChange}
            />
          </Row>}
        {!hasComment && <div className="no-comment">{strings.no_comment}</div>}
      </div>
    );
  }
}

CommentList.propTypes = {
  data: PropTypes.array.isRequired
};

export default CommentList;
