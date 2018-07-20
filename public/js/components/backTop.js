import React, { Component } from 'react';
import { Icon, Popover } from 'antd';
import Feedback from '../components/feedback';
import strings from '../strings';
import '../../scss/backTop.scss';

const backToTop = () => {
  window.scrollTo(0, 0);
};

class BackTop extends Component {
  render() {
    return (
      <div className="slide-bar-container">
        <a className="backtop" onClick={backToTop}>
          <Icon type="to-top" className="icon" />
          <span>{strings.feed_back_to_top}</span>
        </a>
        <Popover trigger="click" content={(<Feedback />)} placement="left">
          <a className="feedback">
            <Icon type="message" className="icon" />
            <span>{strings.feed_feedback}</span>
          </a>
        </Popover>
      </div>
    );
  }
}

export default BackTop;
