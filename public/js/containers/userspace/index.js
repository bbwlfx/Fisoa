import React, { Component } from 'react';
import expr from 'constants/expr';
import PropTypes from 'prop-types';
import Menu from 'components/userspace-menu';
import utils from 'lib/utils';
import Img from 'components/img';
import strings from 'strings';
import { DEFAULT_AVATAR } from 'constants/default';
import 'scss/userspace.scss';
import Nav from '../nav';

const info = window.userInfo;

class Userspace extends Component {
  constructor() {
    super();
    this.state = {
      fans_count: info.fans_count
    };
    utils.bindMethods(['clickMenu', 'postAttention'], this);
  }
  componentDidMount() {
    utils.logEvent('PV_Userprofile');
  }
  render() {
    const { fans_count } = this.state;
    const lvWidth = info.lv === 7 ? '100%' : `${info.expr / expr[info.lv] * 100}%`;
    const lvText = info.lv === 7 ? 'max' : `${info.expr}/${expr[info.lv]}`;
    return (
      <div className="userspace-container">
        <Nav />
        <div className="top-banner" style={{ backgroundImage: `url(${info.banner})` }} />
        <div className="left-body">
          <div className="user-info card-container">
            <div className="user-avatar">
              <Img src={info.avatar || DEFAULT_AVATAR} href={`/profile/${info.uid}`} />
            </div>
            <div className="name">
              <div className="nickname">{info.nickname}</div>
            </div>
            <p className="uid">{`UID: ${info.uid}`}</p>
            <div className="lv">
              <span>LV: </span>
              <div className="expr">
                <span className="bottom" />
                <span
                  className={`top lv${info.lv}-bg`}
                  style={{
                    width: lvWidth
                  }}
                />
                <span className="text">{lvText}</span>
                <span className={`level lv${info.lv}-bg`}>{info.lv}</span>
              </div>
            </div>
            <div className="fans-container">
              <div className="attention">
                <a href="/userspace/content/follow">
                  <p>{strings.common_follow}</p>
                  <p>{info.attention}</p>
                </a>
              </div>
              <div className="fans">
                <p>{strings.userspace_fans}</p>
                <p>{fans_count}</p>
              </div>
            </div>
          </div>
          <div className="tab-container card-container">
            <Menu />
          </div>
        </div>
        <div className="main-body">
          <div className="main-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Userspace.propTypes = {
  children: PropTypes.any.isRequired
};

export default Userspace;
