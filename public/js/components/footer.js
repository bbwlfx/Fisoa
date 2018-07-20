import React, { Component } from 'react';
import { Icon } from 'antd';

class Footer extends Component {
  render() {
    return (
      <div className="footer-container">
        <ul className="footer-list">
          <li><a href="//www.flyingliu.com" target="_blank">本站由沐鱼QwQ提供技术支持</a></li>
          <li>请通过右下角反馈问题提供BUG</li>
          <li>如有疑问请发送邮件至 bbwlfx@126.com 进行反馈</li>
          <li><Icon type="copyright" /> 2018 Fisoa 鲁ICP备xxxxxxxx</li>
        </ul>
      </div>
    );
  }
}

export default Footer;
