import React, { Component } from 'react';
import { publicEncrypt } from 'crypto';
import { Input, Button, Form, Select, message } from 'antd';
import {
  LockOutlined,
  UserOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Banner from '../../components/banner';
import styles from './style.less';
import { get, post } from '../../commons/http';

const { Option } = Select;

export default class extends Component {
  state = {
    loading: false,
    message: '',
    isMount: false,
    allInfo: [],
    publicKey: '',
    countDown: 60,
    isCountDown: false,
  };

  componentDidMount() {
    //拿到所有的用户名
    const getAllUser = async () => {
      const response = await get('/user/userInfo/all');
      // console.log(response.data);
      const { code, data, msg } = response;
      this.setState({ allInfo: data });
    };

    //获取公钥
    const getPublicKey = async () => {
      const response = await get('/user/key');
      const { data } = response;
      window.localStorage.setItem('publicKey', data.key);
      this.setState({ publicKey: data.key });
    };

    getPublicKey();
    getAllUser();
  }

  handleSubmit = async (values) => {
    if (this.state.loading) return;
    const {
      password,
      confirmPassword,
      telephone,
      role,
      userName,
      staffId,
    } = values;
    if (password !== confirmPassword) {
      message.error('两次输入的密码不一致', 1);
      return;
    }
    const rsaPassword = publicEncrypt(
      this.state.publicKey,
      Buffer.from(password)
    ).toString('base64');
    const response = await post('/user/register', {
      name: userName,
      role,
      staffId,
      tel: telephone,
      password: rsaPassword,
    });
    const { data, code, msg } = response;
    if (code === 0) {
      message.success('注册成功', 1);
      window.localStorage.setItem('token', data.token);
      setTimeout(() => {
        this.props.history.replace('/home/competition/all');
      }, 1000);
    } else {
      message.error(msg || '注册失败，请重试', 2);
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
    }
  };

  render() {
    const {
      loading,
      message,
      isMount,
      allInfo,
      countDown,
      isCountDown,
    } = this.state;
    const formItemStyleName = isMount
      ? `${styles['form-item']} ${styles['active']}`
      : styles.formItem;

    return (
      <div className={`${styles['root']}`}>
        {/* <Helmet title="免费注册"/> */}
        <div className={styles.left}>
          <Banner />
        </div>
        <div className={styles.right}>
          <div className={styles.box}>
            <Form
              ref={(form) => (this.form = form)}
              name="register"
              className={styles.inputLine}
              onFinish={this.handleSubmit}
            >
              <div className={formItemStyleName}>
                <div className={styles.header}>免费注册</div>
              </div>
              <div className={formItemStyleName}>
                <Form.Item
                  name="telephone"
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号码',
                    },
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
              {/* <div className={formItemStyleName} style={{ display: 'flex' }}>
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
              </div> */}
              <div className={formItemStyleName}>
                <Form.Item
                  name="staffId"
                  validateFirst={true}
                  rules={[
                    {
                      required: true,
                      message: '请输入学号',
                    },
                    {
                      type: 'string',
                      max: 20,
                      message: '学号长度不超过20个字符',
                    },
                    {
                      type: 'string',
                      min: 8,
                      message: '学号长度不低于8个字符',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const result = allInfo.find((item) => {
                          return value === item.staffId;
                        });
                        if (result) {
                          return Promise.reject('学号已注册');
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
                >
                  <Input
                    allowClear
                    autoFocus
                    prefix={
                      <UserOutlined className={styles.siteFormItemIcon} />
                    }
                    placeholder="学号"
                  />
                </Form.Item>
              </div>
              <div className={formItemStyleName}>
                <Form.Item
                  defaultValue=""
                  name="userName"
                  validateFirst={true}
                  rules={[
                    {
                      required: true,
                      message: '请输入姓名',
                    },
                    {
                      type: 'string',
                      max: 20,
                      message: '姓名长度不超过20个字符',
                    },
                  ]}
                >
                  <Input
                    allowClear
                    autoFocus
                    prefix={
                      <UserOutlined className={styles.siteFormItemIcon} />
                    }
                    placeholder="姓名"
                  />
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
              <div
                className={formItemStyleName}
                style={{ position: 'relative' }}
              >
                <VerifiedOutlined
                  style={{
                    position: 'absolute',
                    zIndex: '9999',
                    left: '11px',
                    top: '13px',
                    transform: 'scale(1.15)',
                  }}
                ></VerifiedOutlined>
                <Form.Item
                  name="role"
                  rules={[{ required: true, message: '请选择身份' }]}
                >
                  <Select placeholder="请选择身份" size="large">
                    <Option value="student">学生</Option>
                    <Option value="teacher">老师</Option>
                  </Select>
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
                      注册
                    </Button>
                  )}
                </Form.Item>
              </div>
            </Form>
            <div className={styles.errorTip}>{message}</div>
            <div className={styles['to-login']}>
              已有账号？
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
