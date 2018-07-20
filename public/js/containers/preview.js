import React, { Component } from 'react';
import Tag from 'components/tag';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import PropTypes from 'prop-types';
import moment from 'moment';
import utils from 'lib/utils';
import strings from 'strings';
import Nav from './nav';
import '../../scss/preview.scss';

export default class Preview extends Component {
  componentDidMount() {
    utils.logEvent('PV_preview_story', {
      source: window.location.query || 'origin'
    });
  }
  render() {
    const {
      title, time, tags, banner
    } = this.props.data;
    const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.data.content)));
    moment.locale('zh-cn');
    return (
      <div className="story-wrapper">
        <div className="story-container">
          <Nav />
          {banner &&
            <div className="article-banner">
              <img src={banner} className="banner-image" />
            </div>}
          <div className="top-container">
            <h2 className="story-title">{title}</h2>
            <span className="time">{moment(+time).format('YYYY-MM-DD')}</span>
            <div className="tags">
              {tags.map((item, index) => {
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
          </div>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  data: PropTypes.object.isRequired
};
