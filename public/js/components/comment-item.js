import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, message } from 'antd';
import moment from 'moment';
import Img from './img';
import utils from '../lib/utils';
import strings from '../strings';
import { POST_ARTICLE_COMMENT_SUPPORT } from '../constants/url';
import { DEFAULT_AVATAR } from '../constants/default';

class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likeCount: props.data.support_count || 0,
      hasLiked: !!props.data.has_support || false
    };
    utils.bindMethods(['likeComment'], this);
  }
  likeComment() {
    const { hasLiked, likeCount } = this.state;
    const { cid } = this.props.data;
    if(hasLiked) {
      return;
    }
    utils.fetch(POST_ARTICLE_COMMENT_SUPPORT, {
      method: 'POST',
      data: {
        cid
      }
    }).then((res) => {
      if(res.type === 0) {
        this.setState({
          likeCount: likeCount + 1,
          hasLiked: true
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  render() {
    const { data } = this.props;
    const { hasLiked, likeCount } = this.state;
    moment.locale('zh-cn');
    return (
      <div className="comment-item-container">
        <div className="user-info">
          <p>
            <Img src={data.avatar || DEFAULT_AVATAR} />
            <a><span className="name">{data.nickname}</span></a>
            <span className="time">{moment(+data.time).format('YYYY-MM-DD')}</span>
          </p>
        </div>
        <div className="comment-content">
          <p>{data.content}</p>
        </div>
        <div className="comment-foot">
          <div className="other-actions">
            {/* <a><Icon type="rollback" />&nbsp;回复</a> */}
            <a
              className={utils.className([{ hasLiked }])}
              onClick={this.likeComment}
            >
              <Icon type={hasLiked ? 'like' : 'like-o'} />&nbsp;{strings.common_support}
            </a>
            {/* <a><Icon type="exclamation-circle-o" />&nbsp;举报</a> */}
          </div>
          <div className="total-like-num">
            <span>{`${likeCount}${strings.common_support}`}</span>
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  data: PropTypes.object.isRequired
};

export default CommentItem;
