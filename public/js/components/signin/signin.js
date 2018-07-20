import React, { Component } from 'react';
import { Form, Icon, Input, Slider, message, Tooltip, Modal } from 'antd';
import Button from 'components/button';
import code from 'constants/code';
import PropTypes from 'prop-types';
import utils from 'lib/utils';
import { LOGIN, REGISTER, HAS_EXIST, FORGET_PASSWORD } from 'constants/url';
import strings from 'strings';
import 'scss/signin.scss';

const FormItem = Form.Item;
const MAX_STEP = 100;

const preventDefault = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      type: 'signin',
      signinLoading: false,
      account: ''
    };
    this.timer = null;
    this.signText = strings.common_signup;
    this.canLogin = false;
    utils.bindMethods(['changeSlideStep', 'changeSignType', 'changeAccount',
      'validateUserName', 'handleSignin', 'handleSignup', 'findPassword', 'close'], this);
  }
  changeAccount(e) {
    this.setState({
      account: e.target.value
    });
  }
  findPassword() {
    Modal.confirm({
      title: strings.sign_find_password,
      content: <div>
        <span>{`${strings.sign_find_password_tooltip}`}</span>
        <p>
          <strong>请输入账号</strong>
          <Input onChange={this.changeAccount} />
        </p>
      </div>,
      onOk: () => {
        const { account } = this.state;
        return utils.fetch(FORGET_PASSWORD, {
          method: 'POST',
          data: {
            account
          }
        }).then((res) => {
          if(res.type === 0) {
            message.success(strings.sign_post_email_success);
            return;
          }
          message.error(res.data.msg || strings.sign_account_not_exist);
        }, () => {
          message.error(strings.common_server_error);
        });
      }
    });
  }
  handleSignin(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        this.setState({ signinLoading: true });
        utils.fetch(LOGIN, {
          method: 'POST',
          data: values
        }).then((res) => {
          this.setState({ signinLoading: false });
          if(res.type === code.banned) {
            message.error(res.data.msg);
            return;
          }
          if(res.type === 0) {
            window.location.reload();
          } else {
            message.error(res.data.msg || strings.account_banned);
          }
        }, () => {
          this.setState({ signinLoading: false });
          message.error(strings.common_server_error);
        });
      }
    });
  }
  handleSignup(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        this.setState({ reigisterLoading: true });
        utils.fetch(REGISTER, {
          method: 'POST',
          data: values
        }).then((res) => {
          if(res.type === 0) {
            this.setState({ reigisterLoading: false });
            message.success(strings.user_sigin_success);
            // 300毫秒之后自动登录
            setTimeout(() => {
              utils.fetch(LOGIN, {
                method: 'POST',
                data: {
                  user_name: values.register_user_name,
                  password: values.register_password
                }
              }).then((res) => {
                this.setState({ signinLoading: false });
                if(res.type === 0) {
                  window.location.reload();
                } else {
                  message.error(res.data.msg || strings.user_login_error);
                }
              }, () => {
                this.setState({ signinLoading: false });
                message.error(strings.common_server_error);
              });
            }, 300);
          } else {
            this.setState({ reigisterLoading: false });
            message.error(res.data.msg || strings.common_server_error);
          }
        }, () => {
          this.setState({ reigisterLoading: false });
          message.error(strings.common_server_error);
        });
      }
    });
  }
  changeSignType() {
    const { type } = this.state;
    let newType = null;
    if(type === 'signin') {
      newType = 'signup';
      this.signText = strings.common_signin;
    } else {
      newType = 'signin';
      this.signText = strings.common_signup;
    }
    this.setState({ type: newType });
  }
  changeSlideStep(step) {
    this.setState({ step });
    if(step === MAX_STEP) {
      this.canLogin = true;
    } else {
      this.canLogin = false;
    }
  }
  close() {
    this.props.destroy();
  }
  validateUserName(rule, value, callback) {
    if(!value) {
      callback(rule.notNullMessage);
      return;
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      utils.fetch(HAS_EXIST, {
        data: {
          username: value
        }
      }).then((res) => {
        if(res.type === 0) {
          callback();
        } else {
          callback(rule.message);
        }
      });
    }, 500);
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { step, type, signinLoading, reigisterLoading } = this.state;
    const isSignin = type === 'signin';
    return (
      <div className="animate-container">
        <div className="sign-container">
          <div className="sign-card" onClick={preventDefault}>
            <div className="sign-head">
              <h2 className="title">Fisoa</h2>
              <a onClick={this.changeSignType} style={{ display: 'block' }}>
                <div className="sign-type" ref={(c) => { this.type = c; }}>
                  <div className="background-icon"><Icon type="scan" /></div>
                  <span>{this.signText}</span>
                </div>
              </a>
              <Icon type="close" className="close" onClick={this.close} />
            </div>
            <div className={utils.className(['signin-container', { 'active': isSignin }])}>
              {isSignin &&
                <Form className="signin-form">
                  <FormItem className="user-name">
                    {getFieldDecorator('user_name', {
                      rules: [{ required: true, whitespace: true, message: '请输入用户名' }]
                    })(<Input prefix={<Icon type="user" style={{ fontSize: 15 }} />} placeholder={strings.sign_mail_placeholder} />)}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, whitespace: true, message: '请输入密码' }]
                    })(<Input prefix={<Icon type="lock" style={{ fontSize: 15 }} />} type="password" placeholder={strings.sign_password_placeholder} />)}
                  </FormItem>
                  <Slider
                    value={step}
                    onChange={this.changeSlideStep}
                  />
                  <p className="slider-desc">{strings.sign_slide_to_right}</p>
                  <FormItem>
                    <a className="signin-form-forgot" onClick={this.findPassword}>
                      {strings.sign_forget_password}&nbsp;
                      <Tooltip title={strings.sign_find_password_tooltip}>
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </a>
                    <Button
                      type="primary"
                      className="sign-form-button"
                      disabled={!this.canLogin}
                      onClick={this.handleSignin}
                      loading={signinLoading}
                    >
                      {strings.common_signin}
                    </Button>
                  </FormItem>
                </Form>}
            </div>
            <div className={utils.className(['signup-container', { 'active': !isSignin }])}>
              {!isSignin &&
                <Form onSubmit={this.handleSignup} className="signup-form">
                  <FormItem>
                    {getFieldDecorator('register_user_name', {
                      rules: [{
                        required: true,
                        whitespace: true,
                        type: 'email',
                        message: '用户已存在，请重新输入',
                        notNullMessage: '用户名不能为空',
                        validator: this.validateUserName
                      }]
                    })(<Input prefix={<Icon type="user" style={{ fontSize: 15 }} />} placeholder={strings.sign_mail_placeholder} />)}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('register_password', {
                      rules: [{ required: true, whitespace: true, min: 8, max: 16, message: '请输入8-16位的密码' }]
                    })(<Input prefix={<Icon type="lock" style={{ fontSize: 15 }} />} type="password" placeholder={strings.sign_password_placeholder} />)}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('register_user_email', {
                      rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }]
                    })(<Input prefix={<Icon type="key" style={{ fontSize: 15 }} />} placeholder={strings.sign_mail_code} />)}
                  </FormItem>
                  <FormItem>
                    <Button
                      type="primary"
                      className="sign-form-button"
                      loading={reigisterLoading}
                      onClick={this.handleSignup}
                    >
                      {strings.common_signup}
                    </Button>
                  </FormItem>
                </Form>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Signin.propTypes = {
  form: PropTypes.any.isRequired,
  destroy: PropTypes.func.isRequired
};
Signin.defaultProps = {};
export default Form.create()(Signin);
