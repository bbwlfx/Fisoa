import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import './divider.scss';

export default class Divider extends Component {
  render() {
    const { children, position } = this.props;
    return (
      <div className={`divider-container ${position}`}>
        {Children && <span className="divider-text">{children}</span>}
      </div>
    );
  }
}

Divider.propTypes = {
  children: PropTypes.any,
  position: PropTypes.string
};
Divider.defaultProps = {
  children: null,
  position: 'center'
};
