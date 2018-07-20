import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Icon, message } from 'antd';
import moment from 'moment';
import Img from './img';
import utils from '../lib/utils';
import strings from '../strings';
import { POST_QUESTION_COMMENT_SUPPORT } from '../constants/url';
import { DEFAULT_AVATAR } from '../constants/default';
import '../../scss/answer-item.scss';

class AnswerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thanksCount: props.thanks_count || 0,
      hasThanks: !!props.has_thanks || false
    };
    utils.bindMethods(['postThanks'], this);
  }
  postThanks() {
    const { hasThanks, thanksCount } = this.state;
    const { cid } = this.props;
    if(hasThanks) {
      return;
    }
    utils.fetch(POST_QUESTION_COMMENT_SUPPORT, {
      method: 'POST',
      data: {
        cid
      }
    }).then((res) => {
      if(res.type === 0) {
        this.setState({
          hasThanks: true,
          thanksCount: thanksCount + 1
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  render() {
    const { author, time, avatar, uid, content } = this.props;
    const { thanksCount, hasThanks } = this.state;
    moment.locale('zh-cn');
    const href = `/profile/${uid}`;
    return (
      <div className="question-item-container card-container">
        <div className="info-container">
          <div className="left">
            <Img src={avatar || DEFAULT_AVATAR} href={href} />
          </div>
          <div className="right">
            <a href={href}><p className="name">{author}</p></a>
            <p className="time">{utils.formatString(strings.question_answer_time, moment(+time).format('YYYY-MM-DD'))}</p>
          </div>
        </div>
        <div className="answer-content">
          <Editor
            editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(content)))}
            wrapperClassName="editor-wrapper comment-editor"
            editorClassName="editor"
            toolbarHidden
            readOnly
            localization={{ locale: 'zh' }}
          />
        </div>
        <div className="answer-actions">
          <ul>
            <li
              onClick={this.postThanks}
              className={utils.className(['thx', { clicked: hasThanks }])}
            >
              <Icon type={hasThanks ? 'heart' : 'heart-o'} />&nbsp;<span>{`${strings.common_thanks} ${thanksCount}`}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
AnswerItem.propTypes = {
  author: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  uid: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  thanks_count: PropTypes.number.isRequired,
  has_thanks: PropTypes.number,
  cid: PropTypes.number.isRequired
};
AnswerItem.defaultProps = {
  has_thanks: 0
};
export default AnswerItem;
