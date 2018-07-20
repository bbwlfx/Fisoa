import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import utils from '../../lib/utils';
import strings from '../../strings';
import './scss/feed-wrap.scss';

export default class FeedWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingData: props.isLoadingData,
      isShowLoading: props.isShowLoading
    };
    this.timer = null;
    utils.bindMethods(['handleScroll'], this);
  }
  componentDidMount() {
    this.handleLoad();
    document.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }
  handleLoad() {
    this.props.loadData().then(() => {
      this.setState({
        isLoadingData: false,
        isShowLoading: false
      });
    }, () => {
      this.setState({
        isLoadingData: false,
        isShowLoading: false
      });
    });
  }
  handleScroll() {
    clearTimeout(this.timer);
    if(!this.props.hasMore) {
      document.removeEventListener('scroll', this.handleScroll);
      return;
    }
    const { delay } = this.props;
    this.timer = setTimeout(() => {
      const { loadHeight } = this.props;
      const scrollTop = window.innerHeight + window.scrollY;
      const bodyHeight = document.body.scrollHeight;
      const { isLoadingData } = this.state;
      if(!isLoadingData && scrollTop > bodyHeight - loadHeight) {
        this.setState({
          isLoadingData: true,
          isShowLoading: true
        });
        this.handleLoad();
      }
    }, delay || 100);
  }

  render() {
    const { className, children, loadingText, noMoreText, hasMore, isShowNoMoreText } = this.props;
    return (
      <div className={utils.className(['feed-wrapper', ...className.split(' ')])}>
        {children}
        <div className="loading-container">
          {this.state.isShowLoading &&
            <div className="loading-content">
              {hasMore && <Icon type="loading" />}
              <span>{loadingText}</span>
            </div>}
          {isShowNoMoreText && !this.state.isShowLoading && !hasMore &&
            <div className="loading-content">
              <span>{noMoreText}</span>
            </div>}
        </div>
      </div>
    );
  }
}
FeedWrap.propTypes = {
  isLoadingData: PropTypes.bool,
  isShowLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.any,
  delay: PropTypes.number,
  loadHeight: PropTypes.number,
  loadData: PropTypes.func,
  loadingText: PropTypes.string,
  noMoreText: PropTypes.string,
  isShowNoMoreText: PropTypes.bool
};
FeedWrap.defaultProps = {
  isLoadingData: true,
  isShowLoading: true,
  hasMore: true,
  className: '',
  children: null,
  delay: 100,
  loadHeight: 60,
  loadData: () => {},
  loadingText: strings.common_loading,
  noMoreText: strings.common_no_more,
  isShowNoMoreText: false
};
