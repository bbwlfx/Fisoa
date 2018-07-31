import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_AVATAR } from '../constants/default';
import utils from '../lib/utils';
import '../../scss/img.scss';

class Img extends Component {
  constructor(props) {
    super(props);
    utils.bindMethods(['onLoad'], this);
  }
  componentDidMount() {
    const { src } = this.props;
    if(!/https?/.test(src)) {
      this.img.className += ' loaded';
    }
  }
  onLoad() {
    this.img.className += ' loaded';
  }
  render() {
    const { href, src, wrapperClassName, ...props } = this.props;
    return (
      <a className={`image-wrapper ${wrapperClassName}`} href={href}>
        <img
          {...props}
          src={src}
          ref={(c) => { this.img = c; }}
          onLoad={this.onLoad}
        />
      </a>
    );
  }
}

Img.propTypes = {
  wrapperClassName: PropTypes.string,
  href: PropTypes.string,
  src: PropTypes.string
};

Img.defaultProps = {
  href: null,
  wrapperClassName: '',
  src: DEFAULT_AVATAR
};

export default Img;
