import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'components/button';
import { message } from 'antd';
import * as actions from './profile_redux';
import Img from '../../components/img';
import { POST_ATTENTION, DELETE_ATTENTION } from '../../constants/url';
import { DEFAULT_AVATAR } from '../../constants/default';
import Nav from '../nav';
import strings from '../../strings';
import utils from '../../lib/utils';
import './scss/profile.scss';

const info = window.profileInfo;
const isSelf = info.uid === window.userInfo.uid;
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      followed: !!info.followed
    };
    utils.bindMethods(['postAttention'], this);
  }
  postAttention() {
    const { followed } = this.state;
    const url = followed ? DELETE_ATTENTION : POST_ATTENTION;
    utils.fetch(url, {
      method: 'POST',
      data: {
        atid: info.uid
      }
    }).then((res) => {
      if(res.type === 0) {
        utils.logEvent('Follow_User');
        this.setState({
          followed: !followed
        });
        if(followed) {
          this.props.actions.minusFans();
        } else {
          this.props.actions.addFans();
        }
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  render() {
    const { followed } = this.state;
    return (
      <div className="profile-wrapper">
        <Nav />
        <div className="profile-container">
          <div className="banner-wrapper card-container" style={{ backgroundImage: `url(${info.banner})` }}>
            <div className="user-container">
              <div className="info-wrapper">
                <Img href="" src={info.avatar || DEFAULT_AVATAR} />
                <div>
                  <p className="nickname">
                    {info.nickname}
                    <span className={`level lv${info.lv}`}>LV{info.lv}</span>
                  </p>
                  <p className="description">简介: {info.description ? info.description : strings.common_no_description}</p>
                  <p className="blog">博客：{info.blog ? info.blog : strings.common_no_content}</p>
                </div>
              </div>
            </div>
            {!isSelf &&
              <Button
                type="primary"
                className={utils.className(['follow-btn', { 'has-followed': followed }])}
                onClick={this.postAttention}
              >
                {followed ? strings.common_unfollow : strings.common_follow}
              </Button>}
          </div>
          <div className="profile-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
Profile.propTypes = {
  children: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired
};
Profile.defaultProps = {};

const mapStateToProps = null;
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...actions
  }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
