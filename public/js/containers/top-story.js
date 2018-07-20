/*
 * @Author: @liufeixiang
 * @Date: 2018-03-03 13:15:35
 * @Last Modified by: @liufeixiang
 * @Last Modified time: 2018-03-28 09:42:00
 */
import React, { Component } from 'react';
import { Affix } from 'antd';
import Feed from './feed';
import Footer from '../components/footer';
import Slider from '../components/slider';
import Recommend from '../components/recommend';
import Nav from './nav';
import '../mysterious/doge';
import '../../scss/top-story.scss';

export default class TopStory extends Component {
  render() {
    return (
      <div className="top-story-container">
        <Nav />
        <div className="main-content">
          <Slider />
          <Feed />
        </div>
        <div className="right-area">
          <Affix offset={70}>
            <Recommend />
            <Footer />
          </Affix>
        </div>
      </div>
    );
  }
}

