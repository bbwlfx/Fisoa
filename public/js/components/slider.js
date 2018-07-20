import React, { Component } from 'react';
import { Carousel } from 'antd';
import '../../scss/slider.scss';

class Slider extends Component {
  render() {
    const config = {
      effect: 'fade',
      dots: true,
      autoplay: true
    };
    return (
      <div className="slider-container card-container">
        <Carousel {...config}>
          <div className="welcome">欢迎加入Fisoa社区</div>
          <div className="post">在这里提出疑问或者书写自己的文章吧</div>
        </Carousel>
      </div>
    );
  }
}
export default Slider;
