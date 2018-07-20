import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Img from './img';
import utils from '../lib/utils';
import strings from '../strings';
import { DEFAULT_AVATAR } from '../constants/default';
import '../../scss/autho-item.scss';

class AuthoItem extends Component {
  constructor(props) {
    super(props);
    utils.bindMethods(['unfollowAction'], this);
  }
  unfollowAction(atid) {
    this.props.unfollowAction(atid);
  }
  render() {
    const { data } = this.props;
    return (
      <div className="autho-item card-container">
        <div className="autho-content">
          <div className="avatar">
            <Img href={`/profile/${data.uid}`} src={data.avatar || DEFAULT_AVATAR} />
          </div>
          <div className="name"><a href={`/profile/${data.uid}`}>{data.nickname}</a></div>
          <div className="unfollow" onClick={() => this.unfollowAction(data.uid)}>
            <span>{strings.user_remove_attention}</span>
          </div>
        </div>
      </div>
    );
  }
}
AuthoItem.propTypes = {
  data: PropTypes.object.isRequired,
  unfollowAction: PropTypes.func.isRequired
};
export default AuthoItem;
