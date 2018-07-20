import React, { Component } from 'react';
import { Spin, Upload, Icon, message, Input, Radio, AutoComplete, Switch, Affix } from 'antd';
import Button from 'components/button';
import { schoolDataSource, jobDataSource } from '../constants/setting';
import utils from '../lib/utils';
import Img from '../components/img';
import Nav from './nav';
import { UPDATE_FIELD, CHANGE_PASSWORD, UPLOAD_AVATAR, UPLOAD_BANNER } from '../constants/url';
import { DEFAULT_AVATAR } from '../constants/default';
import strings from '../strings';
import '../../scss/setting.scss';

// 图片最大5M
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

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

class Setting extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {
        ...window.userInfo,
        avatar: window.userInfo.avatar || DEFAULT_AVATAR
      },
      oldpsw: '',
      newpsw: '',
      seeOldPsw: false,
      seeNewPsw: false,
      uploadingImg: false,
      uploadingBanner: false
    };
    utils.bindMethods(['beforeUpload', 'handleUpload',
      'onMouseDownPasswordIcon', 'uploadField', 'changePassword',
      'onChangeOldPassword', 'onChangeNewPassword', 'changeField'
    ], this);
  }
  componentDidMount() {
    utils.logEvent('PV_Setting');
  }
  uploadField() {
    const { sex, school, area, nickname, blog, qq, wechat, weibo, description, overt, openmail, email } = this.state.userInfo;
    utils.logEvent('Update_Field_Start');
    utils.fetch(UPDATE_FIELD, {
      method: 'POST',
      data: {
        sex,
        school,
        area,
        nickname,
        blog,
        qq,
        wechat,
        weibo,
        description,
        overt,
        openmail,
        email
      }
    }).then((res) => {
      if(res.type === 0) {
        message.success(strings.user_update_success);
        utils.logEvent('Update_Field_Success');
      } else {
        message.error(res.data.msg || strings.common_server_error);
        utils.logEvent('Update_Field_Fail');
      }
    }, () => {
      message.error(strings.common_server_error);
      utils.logEvent('Update_Field_Fail_Server_Error');
    });
  }
  changePassword() {
    const { oldpsw, newpsw } = this.state;
    if(newpsw.length < 8 || newpsw.length > 16) {
      message.error(strings.setting_new_password_length_invalid);
      return;
    }
    utils.logEvent('Change_Password_Start');
    utils.fetch(CHANGE_PASSWORD, {
      method: 'POST',
      data: {
        oldpsw,
        newpsw
      }
    }).then((res) => {
      if(res.type === 0) {
        message.success(strings.user_changepsw_success);
        utils.logEvent('Change_Password_Success');
      } else {
        message.error(res.data.msg || strings.common_server_error);
        utils.logEvent('Change_Password_Fail');
      }
    }, () => {
      message.error(strings.common_server_error);
      utils.logEvent('Change_Password_Fail_Server_Error');
    });
  }
  handleUpload(info, type) {
    if(info.file.percent !== 100) {
      if(type === 'avatar') {
        this.setState({
          uploadingImg: true
        });
      } else {
        this.setState({
          uploadingBanner: false
        });
      }
      return;
    }
    if(type === 'avatar') {
      this.setState({
        uploadingImg: false
      });
    } else {
      this.setState({
        uploadingBanner: false
      });
    }
    const { response } = info.file;
    if(!response) {
      return;
    }
    if(response.type === 0) {
      if(type === 'avatar') {
        const userInfo = Object.assign({}, this.state.userInfo, {
          avatar: response.data.url
        });
        this.setState({ userInfo });
      }
      message.success(strings.common_upload_success);
    } else {
      message.error(response.data.message || strings.common_server_error);
    }
  }
  changeField(type, value) {
    const _value = typeof value === 'string' ? value.trim() : value;
    const userInfo = Object.assign({}, this.state.userInfo, {
      [`${type}`]: _value
    });
    this.setState({ userInfo });
  }
  onChangeOldPassword(e) {
    this.setState({ oldpsw: e.target.value });
  }
  onChangeNewPassword(e) {
    this.setState({ newpsw: e.target.value });
  }
  onMouseDownPasswordIcon(e, type) {
    if(type === 'new') {
      this.setState({
        seeNewPsw: !this.state.seeNewPsw
      });
    } else {
      this.setState({
        seeOldPsw: !this.state.seeOldPsw
      });
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    const { uploadingImg, seeOldPsw, seeNewPsw, oldpsw, newpsw, uploadingBanner, userInfo } = this.state;
    const { avatar, sex, school, area, nickname, blog, qq, wechat,
      weibo, description, overt, openmail, email } = userInfo;
    const oldSuffix = seeOldPsw ?
      (<Icon type="unlock" onMouseDown={e => this.onMouseDownPasswordIcon(e, 'old')} />) :
      (<Icon type="lock" onMouseDown={e => this.onMouseDownPasswordIcon(e, 'old')} />);
    const newSuffix = seeNewPsw ?
      (<Icon type="unlock" onMouseDown={e => this.onMouseDownPasswordIcon(e, 'new')} />) :
      (<Icon type="lock" onMouseDown={e => this.onMouseDownPasswordIcon(e, 'new')} />);
    return (
      <div className="card-container userspace-container">
        <Nav userInfo={userInfo} />
        <div className="user-detail-container">
          <div className="detail-left">
            <Affix>
              <Upload
                className="avatar-uploader"
                accept="image/*"
                name="avatar"
                action={UPLOAD_AVATAR}
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={(info) => { this.handleUpload(info, 'avatar'); }}
                disabled={uploadingImg}
              >
                <Spin spinning={uploadingImg}>
                  {!uploadingImg &&
                  <div className="upload-mask">
                    <Icon type="camera-o" className="camera" />
                  </div>}
                  <Img src={avatar} alt="" className="avatar" />
                </Spin>
              </Upload>
              <Button className="submit-btn" type="primary" onClick={this.uploadField}>{strings.setting_change_info}</Button>
            </Affix>
          </div>
          <div className="detail-right">
            <h2 className="title public">{strings.setting_public}</h2>
            <div className="banner setting-item">
              <p>{strings.setting_banner}</p>
              <Upload
                accept="image/*"
                showUploadList={false}
                action={UPLOAD_BANNER}
                name="banner"
                beforeUpload={this.beforeUpload}
                onChange={(info) => { this.handleUpload(info, 'banner'); }}
                disabled={uploadingBanner}
              >
                <Button loading={uploadingBanner}>
                  <span>{strings.setting_upload_banner}</span>
                </Button>
              </Upload>
            </div>
            <div className="nickname setting-item">
              <p>{strings.setting_nickname}</p>
              <Input
                placeholder={strings.setting_nickname_placeholer}
                maxLength="16"
                onChange={(e) => { this.changeField('nickname', e.target.value); }}
                value={nickname}
              />
            </div>
            <div className="desciption setting-item">
              <p>{strings.setting_description}</p>
              <TextArea
                autosize
                placeholder={strings.setting_description_placeholder}
                maxLength="50"
                onChange={(e) => { this.changeField('description', e.target.value); }}
                value={description}
              />
            </div>
            <div className="sex setting-item">
              <p>{strings.setting_sex}</p>
              <RadioGroup onChange={(e) => { this.changeField('sex', e.target.value); }} value={sex}>
                <Radio value={0}><Icon type="man" /></Radio>
                <Radio value={1}><Icon type="woman" /></Radio>
              </RadioGroup>
            </div>
            <div className="job setting-item">
              <p>{strings.setting_area}</p>
              <AutoComplete
                dataSource={jobDataSource}
                value={area}
                placeholder={strings.setting_area_placeholer}
                onChange={(value) => { this.changeField('area', value); }}
                filterOption={(inputValue, option) =>
                  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>
            <div className="setting-item">
              <p>{strings.setting_mail_push}</p>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="cross" />}
                onChange={(value) => { this.changeField('openmail', value); }}
                checked={!!openmail}
              />
            </div>
            <h2 className="title private">
              <span>{strings.setting_private}</span>
              <span className="public">{strings.setting_is_public}</span>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="cross" />}
                onChange={(value) => { this.changeField('overt', value); }}
                checked={!!overt}
              />
            </h2>
            <div className="school setting-item">
              <p>{strings.setting_school}</p>
              <AutoComplete
                dataSource={schoolDataSource}
                value={school}
                placeholder={strings.setting_school_placeholer}
                onChange={(value) => { this.changeField('school', value); }}
                filterOption={(inputValue, option) =>
                  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>
            <div className="blog setting-item">
              <p>{strings.setting_blog}</p>
              <Input
                placeholder={strings.setting_blog_placeholder}
                maxLength="30"
                onChange={(e) => { this.changeField('blog', e.target.value); }}
                value={blog}
              />
            </div>
            <div className="weibo setting-item">
              <p>{strings.setting_weibo}</p>
              <Input
                placeholder={strings.setting_weibo_placeholer}
                maxLength="30"
                onChange={(e) => { this.changeField('weibo', e.target.value); }}
                value={weibo}
              />
            </div>
            <div className="setting-item">
              <p>{strings.setting_email}</p>
              <Input
                placeholder={strings.setting_email_placeholer}
                maxLength="50"
                onChange={(e) => { this.changeField('email', e.target.value); }}
                value={email}
              />
            </div>
            <div className="weixin setting-item">
              <p>{strings.setting_weixin}</p>
              <Input
                placeholder={strings.setting_weixin_placeholer}
                maxLength="20"
                onChange={(e) => { this.changeField('wechat', e.target.value); }}
                value={wechat}
              />
            </div>
            <div className="qq setting-item">
              <p>{strings.setting_qq}</p>
              <Input
                placeholder={strings.setting_qq_placeholer}
                maxLength="20"
                onChange={(e) => { this.changeField('qq', e.target.value); }}
                value={qq}
              />
            </div>
            <div className="change-password">
              <h2 className="title">{strings.setting_change_password}</h2>
              <div>
                <Input
                  placeholder={strings.setting_old_password_placeholer}
                  maxLength="20"
                  type={seeOldPsw ? 'input' : 'password'}
                  suffix={oldSuffix}
                  value={oldpsw}
                  onChange={this.onChangeOldPassword}
                />
              </div>
              <div>
                <Input
                  placeholder={strings.setting_new_password_placeholer}
                  maxLength="20"
                  type={seeNewPsw ? 'input' : 'password'}
                  suffix={newSuffix}
                  value={newpsw}
                  onChange={this.onChangeNewPassword}
                />
              </div>
              <div><Button type="primary" onClick={this.changePassword}>确认修改密码</Button></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Setting;
