import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './tag.scss';

export default class Tag extends Component {
  render() {
    const { children, color } = this.props;
    const style = color ? {
      color,
      borderColor: color
    } : {};
    return (
      <div
        className="tag-wrapper"
        style={style}
      >
        <span className="tag-text">{children}</span>
      </div>
    );
  }
}

Tag.propTypes = {
  color: PropTypes.string,
  children: PropTypes.any
};

Tag.defaultProps = {
  color: '',
  children: ''
};
