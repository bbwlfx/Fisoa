import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Img from '../../../../components/img';
import HTMLContent from '../../../../components/html-content';
import './message-item.scss';

export default class MessageItem extends Component {
  render() {
    const { data } = this.props;
    const { avatar, uid, content, nickname, time } = data;
    const href = uid ? `/profile/${uid}` : null;
    return (
      <div className="message-item-wrapper">
        <div className="avatar">
          <Img src={avatar} href={href} />
        </div>
        <div className="message-body">
          <div className="message-name"><a href={href}>{nickname}</a></div>
          <HTMLContent className="message">{content}</HTMLContent>
          <div className="time">{moment(+time).format('YYYY-MM-DD hh:mm:ss')}</div>
        </div>
      </div>
    );
  }
}

MessageItem.propTypes = {
  data: PropTypes.object.isRequired
};
MessageItem.defaultProps = {};
