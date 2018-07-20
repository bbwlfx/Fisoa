import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthoItem from './autho-item';

class AuthoList extends Component {
  render() {
    const { data, unfollowAction } = this.props;
    return (
      <div className="autho-list">
        {data.map((item, index) => (
          <AuthoItem key={index} data={item} unfollowAction={unfollowAction} />
        ))}
      </div>
    );
  }
}
AuthoList.propTypes = {
  data: PropTypes.array.isRequired,
  unfollowAction: PropTypes.func.isRequired
};
export default AuthoList;
