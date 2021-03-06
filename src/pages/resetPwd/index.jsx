import React, { Component } from 'react';
import { Input, Button, Form, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Banner from '../../components/banner';
import styles from './style.less';
import { get, post } from '../../commons/http';
import { connect } from 'react-redux';
import { updateUserInfo } from '../../store/user/action';
import { toLogin } from '../../commons';
import { Link } from 'react-router-dom';
import Captcha from 'react-captcha-code';
import { publicEncrypt } from 'crypto';

class ResetPwd extends Component {
  state = {
    loading: false,
    message: '',
    isMount: false,
    publicKey: '',
    captcha: '',
    countDown: 60,
    isCountDown: false,
    publicKey: '',
  };

  componentDidMount() {
    //获取公钥
    const getPublicKey = async () => {
      const response = await get('/user/key');
      const { data } = response;
      this.setState({ publicKey: data.key });
      window.localStorage.setItem('publicKey', data.key);
    };
    getPublicKey();
  }

  setCode = (captcha) => {
    this.setState({ captcha });
  };

  handleSubmit = async (values) => {
    const { tel, verifyCode, password, confirmPassword } = values;
    const cdnResponse = await post(
      `http://localhost:3000/uploadToGuochuangyun?s=App.Sms.CheckSmsCaptcha&app_key=5687BCD24AA4D3C1ED073F5C8AC17C6B&mobile=${tel}&code=${verifyCode}`,
      {},
      true
    );
    if (cdnResponse.ret === 200) {
      if (cdnResponse.data?.err_code !== 0) {
        //失败
        message.error(cdnResponse.data?.err_msg, 1);
        return;
      }
    } else {
      message.error('出错啦，请稍后重试', 1);
      return;
    }

    if (password !== confirmPassword) {
      message.error('两次输入的密码不一致', 1);
      return;
    }

    const rsaPassword = publicEncrypt(
      this.state.publicKey,
      Buffer.from(password)
    ).toString('base64');
    const response = await post('/user/resetPassword', {
      tel,
      password: rsaPassword,
    });
    const { data, code, msg } = response;
    if (code === 0) {
      message.success('修改成功', 1);
      setTimeout(() => {
        toLogin();
      }, 1000);
    } else {
      message.error(msg || '操作失败，请重试', 2);
    }
  };

  sendVerifyCode = async () => {
    const { tel } = this.form.getFieldValue();
    const response = await post(
      `http://localhost:3000/uploadToGuochuangyun?s=Supplier.YesApi.SendSmsCatpcha&app_key=5687BCD24AA4D3C1ED073F5C8AC17C6B&mobile=${tel}`,
      {},
      true
    );
    if (response.ret === 200) {
      //发送成功，倒计时60s
      this.setState({ isCountDown: true });
      const interval = setInterval(() => {
        if (this.state.countDown === 0) {
          this.setState({ countDown: 60, isCountDown: false });
          clearInterval(interval);
          return;
        }
        this.setState({ countDown: this.state.countDown - 1 });
      }, 1000);
    } else {
      message.error('获取验证码失败，请稍后重试', 1);
    }
  };

  render() {
    const {
      loading,
      message,
      isMount,
      captcha,
      isCountDown,
      countDown,
    } = this.state;
    const formItemStyleName = isMount
      ? `${styles['form-item']} ${styles['active']}`
      : styles.formItem;

    return (
      <div className={`${styles['root']}`}>
        {/* <Helmet title="欢迎登陆"/> */}
        <div className={styles.left}>
          <Banner />
        </div>
        <div className={styles.right}>
          <div className={styles.box}>
            <Form
              ref={(form) => (this.form = form)}
              name="login"
              className={styles.inputLine}
              onFinish={this.handleSubmit}
            >
              <div className={formItemStyleName}>
                <div className={styles.header}>找回密码</div>
              </div>
              <div className={formItemStyleName}>
                <Form.Item
                  name="tel"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    {
                      message: '请输入正确的手机号码',
                      type: 'string',
                      len: 11,
                      pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    },
                  ]}
                >
                  <Input
                    allowClear
                    autoFocus
                    prefix={
                      <UserOutlined className={styles.siteFormItemIcon} />
                    }
                    placeholder="手机号"
                  />
                </Form.Item>
              </div>
              <div className={formItemStyleName} style={{ display: 'flex' }}>
                <div
                  style={{ width: '100px', height: '42px', marginRight: '3px' }}
                >
                  <Captcha
                    charNum={4}
                    onChange={this.setCode}
                    width={100}
                    height={42}
                  />
                </div>
                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: '请输入验证码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const result = value === captcha ? true : false;
                        if (result) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject('验证码错误');
                        }
                      },
                    }),
                  ]}
                  validateFirst={true}
                >
                  <Input allowClear autoFocus placeholder="验证码" />
                </Form.Item>
              </div>
              <div className={formItemStyleName} style={{ display: 'flex' }}>
                <div
                  className={formItemStyleName}
                  style={{ marginRight: '4px' }}
                >
                  <Form.Item
                    shouldUpdate={true}
                    style={{ marginBottom: 0, width: '100px' }}
                  >
                    {() => (
                      <Button
                        disabled={
                          !this.form?.isFieldsTouched(['tel', 'code'], true) ||
                          this.form
                            ?.getFieldsError(['tel', 'code'])
                            .filter(({ errors }) => errors.length).length ||
                          isCountDown
                        }
                        style={{ width: '100%' }}
                        onClick={this.sendVerifyCode}
                      >
                        {isCountDown ? `${countDown}S` : '获取验证码'}
                      </Button>
                    )}
                  </Form.Item>
                </div>
                <Form.Item
                  name="verifyCode"
                  rules={[{ required: true, message: '请输入验证码' }]}
                  validateFirst={true}
                >
                  <Input allowClear autoFocus placeholder="验证码" />
                </Form.Item>
              </div>
              <div className={formItemStyleName}>
                <Form.Item
                  name="password"
                  shouldUpdate={true}
                  rules={[
                    { required: true, message: '请输入密码' },
                    {
                      type: 'string',
                      min: 6,
                      message: '密码长度不能低于6位',
                    },
                    {
                      type: 'string',
                      max: 20,
                      message: '密码长度不能高于20位',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined className={styles.siteFormItemIcon} />
                    }
                    placeholder="密码"
                  />
                </Form.Item>
              </div>
              <div className={formItemStyleName}>
                <Form.Item
                  name="confirmPassword"
                  shouldUpdate={true}
                  rules={[
                    { required: true, message: '请再次输入密码' },
                    {
                      type: 'string',
                      min: 6,
                      message: '密码长度不能低于6位',
                    },
                    {
                      type: 'string',
                      max: 20,
                      message: '密码长度不能高于20位',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined className={styles.siteFormItemIcon} />
                    }
                    placeholder="确认密码"
                  />
                </Form.Item>
              </div>
              <div className={formItemStyleName}>
                <Form.Item shouldUpdate={true} style={{ marginBottom: 0 }}>
                  {() => (
                    <Button
                      className={styles.submitBtn}
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                      disabled={
                        !this.form?.isFieldsTouched(true) ||
                        this.form
                          ?.getFieldsError()
                          .filter(({ errors }) => errors.length).length
                      }
                      style={{ width: '100%' }}
                    >
                      提交
                    </Button>
                  )}
                </Form.Item>
              </div>
            </Form>
            <div className={styles.errorTip}>{message}</div>
            <div className={styles['to-login']}>
              <Link to="/login" style={{ color: 'lightskyblue' }}>
                立即登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    const { userInfo } = state;
    return { userInfo };
  },
  (dispatch) => {
    return {
      updateUser: (data) => {
        dispatch(updateUserInfo(data));
      },
    };
  }
)(ResetPwd);
