import React, { Component } from 'react';
import { Modal } from 'antd';
import Signin from './signin';

export default class Sign extends Component {
  static show() {
    const ref = Modal.info({
      maskClosable: false,
      content: <Signin destroy={() => ref.destroy()} />,
      className: 'signin-modal',
      iconType: ''
    });
  }
}
