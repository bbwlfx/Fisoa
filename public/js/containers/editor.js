import React, { Component } from 'react';
import { Input, Tag, Icon, message, Modal, Popover, Upload } from 'antd';
import Button from 'components/button';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import utils from 'lib/utils';
import toolbar from 'constants/toolbar';
import strings from 'strings';
import { POST_ARTICLE, UPLOAD_IMAGE } from 'constants/url';
import Preview from 'lib/preview';
import Nav from './nav';
import '../../scss/editor.scss';
import '../../scss/react-draft-wysiwyg.scss';

const TAG_VALUE_LENGTH = 20;
const TAGS_MAX_COUNT = 3;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const beforeUpload = (file) => {
  const isJPG = file.type.includes('image/');
  if(!isJPG) {
    message.error('只能上传jpg格式的图片');
  }
  const isLt5M = file.size <= MAX_IMAGE_SIZE;
  if(!isLt5M) {
    message.error('图片大小不能超过5MB');
  }
  return isJPG && isLt5M;
};

const isEdit = window.location.href.includes('edit');

const state = {
  editorState: EditorState.createEmpty(),
  title: '',
  publishLoading: false,
  tags: [],
  tagsInputVisible: false,
  tagsInputValue: '',
  active: true,
  openCover: false,
  cover: '',
  uploadingCover: false,
  banner: '',
  uploadingBanner: false
};

const _initState = window.__INITSTATE__ || {};

const initState = isEdit ? Object.assign({}, state, {
  editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(_initState.content || '{}'))),
  ..._initState
}) : state;

class DraftEditor extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
    utils.bindMethods(['changeEditorState',
      'handleClose', 'showInput', 'handleInputChange',
      'postArticle', 'changeTitle', 'previewArticle',
      'handleSubmit', 'resetContent'], this);
  }
  componentDidMount() {
    utils.logEvent('PV_Editor');
    window.addEventListener('mousemove', this.handleMouseMove);
  }
  changeEditorState(editorState) {
    this.setState({ editorState });
  }
  resetContent() {
    Modal.confirm({
      content: strings.article_reconfirm_reset,
      okText: strings.common_confirm,
      cancelText: strings.common_cancel,
      onOk: () => {
        this.setState(initState);
      }
    });
  }
  handleClose(removedTag) {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  }
  showInput() {
    const { tags } = this.state;
    if(tags && tags.length <= TAGS_MAX_COUNT) {
      this.setState({ tagsInputVisible: true }, () => this.input.focus());
    }
  }
  handleInputChange(e) {
    if(e.target.value.length < TAG_VALUE_LENGTH) {
      this.setState({ tagsInputValue: e.target.value });
    }
  }
  handleInputConfirm = () => {
    const { tags, tagsInputValue } = this.state;
    let _tags = tags;
    if(tagsInputValue && tags.indexOf(tagsInputValue) === -1) {
      _tags = [...tags, tagsInputValue];
    }
    this.setState({
      tags: _tags,
      tagsInputVisible: false,
      tagsInputValue: ''
    });
  }
  changeTitle = (e) => {
    this.setState({
      title: e.target.value
    });
  }
  handleSubmit() {
    const content = isEdit ? strings.edit_reconfirm : strings.article_reconfirm;
    Modal.confirm({
      content,
      okText: strings.common_confirm,
      cancelText: strings.common_cancel,
      onOk: this.postArticle
    });
  }
  postArticle() {
    utils.logEvent('Post_Article_Start');
    const { editorState, tags, title, cover, banner, aid } = this.state;
    if(title.trim() && editorState) {
      utils.fetch(POST_ARTICLE, {
        method: 'POST',
        data: {
          content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          title: title.trim(),
          tags,
          time: Date.now().toString(),
          cover,
          banner,
          edit: isEdit,
          aid
        }
      }).then((res) => {
        if(res.type === 0) {
          utils.logEvent('Post_Article_Success');
          Modal.success({
            title: strings.article_success,
            okText: strings.common_confirm,
            onOk: () => {
              window.location.href = '/userspace/content';
            }
          });
        } else {
          message.error(res.data.msg || strings.article_post_error);
          utils.logEvent('Post_Article_Fail');
        }
      }, () => {
        message.error(strings.common_server_error);
        utils.logEvent('Post_Article_Fail_Server_Error');
      });
    } else {
      message.error(strings.article_not_null);
    }
  }
  uploadImage(info, type, state) {
    if(info.file.percent !== 100) {
      this.setState({
        [`${state}`]: true
      });
      return;
    }
    this.setState({
      [`${state}`]: false
    });
    const { response } = info.file;
    if(!response) {
      return;
    }
    if(response.type === 0) {
      this.setState({
        [`${type}`]: response.data.url
      });
    } else {
      message.error(response.data.message || strings.common_server_error);
    }
  }
  getPopoverContent() {
    const { cover, uploadingCover } = this.state;
    return (
      <div className="cover-popover">
        <Upload
          accept="image/*"
          name="image"
          action={UPLOAD_IMAGE}
          showUploadList={false}
          beforeUpload={beforeUpload}
          disabled={uploadingCover}
          onChange={(info) => { this.uploadImage(info, 'cover', 'uploadingCover'); }}
        >
          {!cover && <div className="no-cover">
            {strings.article_set_cover_tooltip}
            {uploadingCover && <Icon type="loading" />}
          </div>}
          {cover && <img src={cover} className="article-cover" />}
        </Upload>
      </div>
    );
  }
  getBannerContent() {
    const { banner, uploadingBanner } = this.state;
    return (
      <div className="banner-wrapper">
        <Upload
          accept="image/*"
          name="image"
          action={UPLOAD_IMAGE}
          showUploadList={false}
          beforeUpload={beforeUpload}
          disabled={uploadingBanner}
          onChange={(info) => { this.uploadImage(info, 'banner', 'uploadingBanner'); }}
        >
          {!banner && <div className="no-banner">
            {strings.article_set_banner_tooltip}
            {uploadingBanner && <Icon type="loading" />}
          </div>}
          {banner && <img src={banner} className="banner-cover" />}
        </Upload>
      </div>
    );
  }

  previewArticle() {
    const key = Math.random().toString(36).slice(2, 10).toUpperCase();
    const { editorState, title, tags, banner } = this.state;
    if(!title || !editorState) {
      message.error(strings.article_not_null);
      return;
    }
    const state = {
      content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      title: title.trim(),
      tags,
      time: Date.now().toString(),
      banner
    };
    Preview.saveInfo(key, state);
    window.open(`/preview/${key}`);
  }

  render() {
    const {
      editorState,
      publishLoading,
      tags,
      title,
      tagsInputVisible,
      tagsInputValue
    } = this.state;

    const middleComponent = (
      <div className="post-card-container">
        <ul className="post-list">
          <li>
            <a onClick={this.previewArticle}>
              <Icon type="eye-o" />
              <span>{strings.edit_preview}</span>
            </a>
          </li>
          <li>
            <a onClick={this.resetContent}>
              <Icon type="reload" />
              <span>{isEdit ? strings.edit_reset : strings.article_reset}</span>
            </a>
          </li>
          <li>
            <a onClick={this.handleSubmit}>
              <Icon type="file-text" />
              <span>{isEdit ? strings.edit_modify : strings.article_post_article}</span>
              {publishLoading && <Icon type="loading" />}
            </a>
          </li>
        </ul>
      </div>
    );

    return (
      <div className="editor-container">
        <Nav middleComponent={middleComponent} />
        {this.getBannerContent()}
        <div className="content-wrapper">
          <div className="title-container">
            <Input
              placeholder={strings.article_placeholder_title}
              maxLength="30"
              className="title"
              onChange={this.changeTitle}
              value={title}
            />
          </div>
          <div className="tags-container">
            <div className="tags-content">
              <span className="tags-title">
                <Icon type="tag-o" />&nbsp;
                {strings.article_tags}
              </span>
              {
                tags.map((tag, index) =>
                  <Tag key={index} closable afterClose={() => this.handleClose(tag)}>{tag}</Tag>)
              }
              {tagsInputVisible && (
                <Input
                  ref={(c) => { this.input = c; }}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={tagsInputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                />)}
              {!tagsInputVisible &&
                tags.length < TAGS_MAX_COUNT &&
                <Button size="small" type="dashed" onClick={this.showInput}>{strings.article_add_new_tags}</Button>}
            </div>
          </div>
          <div className="content-container">
            <Editor
              editorState={editorState}
              wrapperClassName="editor-wrapper"
              editorClassName="editor"
              onEditorStateChange={this.changeEditorState}
              toolbar={toolbar}
              localization={{ locale: 'zh' }}
              placeholder={strings.article_placeholder}
            />
          </div>
        </div>
        <div className="upload-cover-container">
          <Popover
            trigger="click"
            content={this.getPopoverContent()}
            placement="top"
            arrowPointAtCenter
          >
            <div className="upload-cover">
              <Icon type="camera" />
              <div className="upload-text">{strings.edit_upload_cover}</div>
            </div>
          </Popover>
        </div>
      </div>
    );
  }
}

export default DraftEditor;
