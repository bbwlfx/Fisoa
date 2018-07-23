import React, { Component } from 'react';
import { Icon, message } from 'antd';
import PropTypes from 'prop-types';
import Tag from 'components/tag';
import { EditorState, convertFromRaw } from 'draft-js';
import Button from 'components/button';
import { Editor } from 'react-draft-wysiwyg';
import Clipboard from 'clipboard';
import moment from 'moment';
import { DEFAULT_AVATAR } from 'constants/default';
import SimpleArticleList from 'components/simple-article-list';
import CommentList from 'components/comment-list';
import { ARTICLE_GET_COMMENT, POST_ARTICLE_SUPPORT,
  POST_COLLECT, VIEW_ARTICLE, POST_ATTENTION,
  DELETE_ATTENTION, GET_SIMPLE_ARTICLE_LIST } from 'constants/url';
import { articleType } from 'constants/articleType';
import Img from 'components/img';
import utils from 'lib/utils';
import history from 'lib/history';
import strings from 'strings';
import Nav from './nav';
import '../../scss/story.scss';

const viewStory = (aid) => {
  utils.fetch(VIEW_ARTICLE, {
    data: { aid }
  });
};

export default class Story extends Component {
  constructor(props) {
    super(props);
    const { articleInfo } = props;
    this.state = {
      editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(articleInfo.content))),
      commend: !!articleInfo.has_support || false,
      support: articleInfo.support_count,
      collect: !!articleInfo.has_collect || false,
      collectCount: articleInfo.collect_count,
      data: [],
      followed: !!articleInfo.followed,
      articleList: [],
      loadingArticle: false,
      fans_count: articleInfo.author_fans_count
    };
    utils.bindMethods(['postSupport', 'postCollect', 'postAttention', 'getArticleList'], this);
  }
  componentDidMount() {
    utils.splitSearch(window.location);
    const { userInfo, articleInfo } = this.props;
    if(userInfo.hasLogin) {
      history.saveHistory(userInfo.uid, {
        title: articleInfo.title,
        href: `/article/${articleInfo.aid}`,
        type: articleType.Article,
        id: articleInfo.aid
      });
    }
    this.getArticleList();
    this.getComments();
    viewStory(articleInfo.aid);
    utils.logEvent('PV_Story', {
      source: window.location.query || 'origin'
    });
    const clipboard = new Clipboard('#share', {
      text: () => `我发现了一篇特别好的文章《${articleInfo.title}》，点击这里进行阅读：${window.location.href}?source=share`
    });
    if(clipboard) {
      clipboard.on('success', () => {
        message.success(strings.article_copy_success);
      });
      clipboard.on('error', () => {
        message.error(strings.article_can_not_copy);
      });
    }
  }
  getArticleList() {
    this.setState({
      loadingArticle: true
    });
    utils.fetch(GET_SIMPLE_ARTICLE_LIST, {
      data: {
        uid: this.props.articleInfo.uid
      }
    }).then((res) => {
      if(res.type === 0) {
        this.setState({
          articleList: res.data,
          loadingArticle: false
        });
      }
    }, () => {
      this.setState({
        loadingArticle: false
      });
    });
  }
  postSupport() {
    if(this.state.commend) {
      return;
    }
    const { articleInfo } = this.props;
    utils.fetch(POST_ARTICLE_SUPPORT, {
      method: 'POST',
      data: {
        aid: articleInfo.aid
      }
    }).then((res) => {
      if(res.type === 0) {
        utils.logEvent('Support_Article', {
          ArticleId: articleInfo.aid
        });
        this.setState({
          commend: true,
          support: this.state.support + 1
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  getComments() {
    utils.fetch(ARTICLE_GET_COMMENT, {
      data: {
        aid: this.props.articleInfo.aid
      }
    }).then((res) => {
      if(res.type === 0) {
        this.setState({
          data: res.data.comments
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  postAttention() {
    const { followed } = this.state;
    const url = followed ? DELETE_ATTENTION : POST_ATTENTION;
    utils.fetch(url, {
      method: 'POST',
      data: {
        atid: this.props.articleInfo.uid
      }
    }).then((res) => {
      if(res.type === 0) {
        utils.logEvent('Follow_User');
        const fans_count = followed ? this.state.fans_count - 1 : this.state.fans_count + 1;
        this.setState({
          followed: !followed,
          fans_count
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  postCollect() {
    if(this.state.collect) {
      return;
    }
    utils.fetch(POST_COLLECT, {
      method: 'POST',
      data: {
        aid: this.props.articleInfo.aid
      }
    }).then((res) => {
      if(res.type === 0) {
        utils.logEvent('Collect_Article');
        this.setState({
          collect: true,
          collectCount: this.state.collectCount + 1
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }
  render() {
    const { articleInfo, isSelf, userInfo } = this.props;
    const {
      editorState, commend, support, collect,
      collectCount, data, followed, articleList,
      loadingArticle, fans_count
    } = this.state;
    const {
      title, time, author, tags, uid, banner, view
    } = articleInfo;
    const _tags = tags.split(',');
    const href = `/profile/${uid}`;
    moment.locale('zh-cn');
    return (
      <div className="story-wrapper">
        <div className="left-area">
          <div className="article-commend">
            <div
              className={utils.className(['commend', { clicked: commend }])}
              onClick={this.postSupport}
            >
              <div className="icon-area">
                <Icon type={commend ? 'like' : 'like-o'} />
              </div>
              {support}
            </div>
            <div
              className={utils.className(['collect', { clicked: collect }])}
              onClick={this.postCollect}
            >
              <div className="icon-area">
                <Icon type={collect ? 'heart' : 'heart-o'} />{}
              </div>
              {collectCount}
            </div>
            <div className="share" id="share">
              <div className="icon-area">
                <Icon type="export" />
              </div>
              {`${strings.common_share}`}
            </div>
          </div>
        </div>
        <div className="story-container">
          <Nav userInfo={userInfo} />
          {banner &&
            <div className="article-banner">
              <img src={banner} className="banner-image" />
            </div>}
          <div className="top-container">
            <h2 className="story-title">{title}</h2>
            <span className="view">{`${view}阅读`}</span>
            <span className="time">{moment(+time).format('YYYY-MM-DD')}</span>
            <div className="tags">
              {_tags.map((item, index) => {
                if(item) {
                  return <Tag key={index}>{item}</Tag>;
                }
                return <Tag key={index}>{strings.article_undefined_tag}</Tag>;
              })}
            </div>
          </div>
          <div className="article-container">
            <Editor
              editorState={editorState}
              wrapperClassName="editor-wrapper"
              editorClassName="editor"
              toolbarHidden
              readOnly
              localization={{ locale: 'zh' }}
            />
            <CommentList data={data} userInfo={userInfo} articleInfo={articleInfo} />
          </div>
        </div>
        <div className="right-area">
          <div className="autho-container">
            <Img
              wrapperClassName="avatar"
              src={articleInfo.avatar || DEFAULT_AVATAR}
              href={href}
            />
            <div className="autho-right">
              <a className="name" href={href}>{author}</a>
              <div className="autho-fans">{`粉丝量: ${fans_count}`}</div>
            </div>
            <div className="pay_attention_btn">
              {!isSelf &&
                <Button
                  type="primary"
                  className={utils.className(['follow-btn', { 'has-followed': followed }])}
                  onClick={this.postAttention}
                >
                  {followed ? strings.common_unfollow : strings.common_follow}
                </Button>}
            </div>
          </div>
          <h4 className="block-title">{strings.story_simple_list_title}</h4>
          <SimpleArticleList list={articleList} uid={articleInfo.uid} loading={loadingArticle} />
        </div>
      </div>
    );
  }
}
Story.propTypes = {
  userInfo: PropTypes.object.isRequired,
  isSelf: PropTypes.bool.isRequired,
  articleInfo: PropTypes.object.isRequired
};
