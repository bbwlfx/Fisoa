import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Tag from 'components/tag';
import LazyLoad from 'react-lazy-load';
import moment from 'moment';
import Img from './img';
import strings from '../strings';
import { DEFAULT_AVATAR } from '../constants/default';
import '../../scss/feed-card.scss';

class FeedCard extends Component {
  render() {
    const { data } = this.props;
    const {
      title, avatar, time, nickname, uid,
      comment_count, collect_count, lv, view,
      aid, qid, detail, description, content,
      cover
    } = data;
    const haveTags = !!data.tags;
    const isArticle = !!aid;
    const tags = data.tags.split(',');
    const href = isArticle ? `/article/${aid}` : `/question/${qid}`;
    const authorHref = `/profile/${uid}`;
    moment.locale('zh-cn');
    return (
      <div className="feed-card">
        <div className="feed-card-left">
          <div className="title">
            <a href={href} className={cover ? 'has-left' : ''}>{title}</a>
          </div>
          <div className="author-area">
            <div className="avatar">
              <Img src={avatar || DEFAULT_AVATAR} href={authorHref} />
            </div>
            <div className="detail">
              <div className="author-data">
                <div className="author-name">
                  <a href={authorHref}>
                    {nickname}
                    <span className={`lv lv${lv}`}>{`lv${lv}`}</span>
                    <span className="description">{description}</span>
                  </a>
                </div>
                {isArticle &&
                  <div className="view">
                    <Icon type="eye-o" />&nbsp;
                    <span>{view}</span>
                  </div>}
                <div className="comment">
                  <Icon type="message" />&nbsp;
                  <span>{comment_count}</span>
                </div>
                {isArticle &&
                  <div className="collect">
                    <Icon type="heart-o" />&nbsp;
                    <span>{collect_count}</span>
                  </div>}
                <div className="page-time">{moment(+time).format('YYYY-MM-DD')}</div>
              </div>
              <div className="tags">
                {haveTags && tags.map((item, index) => (
                  <Tag key={index} color="#0084ff">{item}</Tag>
                ))}
                {!haveTags && <Tag key="0" color="#0084ff">{strings.article_undefined_tag}</Tag>}
              </div>
            </div>
          </div>
          <div className="description">
            <a href={href}>{detail || content}</a>
          </div>
        </div>
        {cover &&
          <div className="feed-card-right">
            <LazyLoad>
              <Img className="cover" src={cover} href={href} />
            </LazyLoad>
          </div>}
      </div>
    );
  }
}

FeedCard.propTypes = {
  data: PropTypes.object.isRequired
};

export default FeedCard;
