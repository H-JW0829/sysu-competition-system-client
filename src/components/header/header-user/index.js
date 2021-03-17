import React, { Component } from 'react';
import {
  CaretDownOutlined,
  EditOutlined,
  LogoutOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { publicEncrypt } from 'crypto';
import { Menu, Dropdown, Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { toLogin } from '../../../commons';
import styles from './style.less';
import { get, post } from '../../../commons/http';
import ModifyPwdForm from './modifyPwdForm';
import SettingForm from './settingForm';

const { confirm } = Modal;
const Item = Menu.Item;

export default class HeaderUser extends Component {
  static defaultProps = {
    theme: 'default',
  };

  state = {
    showModal: false,
    showSettingModal: false,
  };

  handleSubmit = async (values) => {
    const { newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      message.error('两次输入密码不一致', 1);
    } else {
      let publicKey = window.localStorage.getItem('publicKey');
      if (!publicKey) {
        const response = await get('/user/key');
        const { data } = response;
        publicKey = data.key;
        window.localStorage.setItem('publicKey', data.key);
      }
      const rsaPassword = publicEncrypt(
        publicKey,
        Buffer.from(newPassword)
      ).toString('base64');
      const response = await post('/user/resetPassword', {
        //id
        id: this.props.userInfo.id,
        password: rsaPassword,
      });
      if (response.code === 0) {
        message.success('密码修改成功', 1);
        setTimeout(() => {
          this.setState({ showModal: false });
        }, 1000);
      } else {
        message.error(response.msg || '密码修改失败，请稍后尝试');
      }
    }
  };

  modifyPassword = () => {
    this.setState({ showModal: true });
  };

  handleOk = () => {
    this.setState({ showModal: false });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  setting = () => {
    this.setState({ showSettingModal: true });
  };

  closeSettingModal = () => {
    this.setState({ showSettingModal: false });
  };

  modifySuccess = () => {
    this.setState({ showSettingModal: false });
  };

  render() {
    // const user = getLoginUser() || {};

    const { className, theme, userInfo, showModal } = this.props;
    console.log(userInfo);
    const logout = () => {
      // toLogin();
      confirm({
        title: '您确定要退出登录吗？',
        icon: <ExclamationCircleOutlined />,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          window.localStorage.removeItem('token');
          setTimeout(() => {
            toLogin();
          }, 500);
        },
      });
    };

    const menu = (
      <Menu className={styles.menu} theme={theme} selectedKeys={[]}>
        <Item key="modifyPassword" onClick={this.modifyPassword}>
          <EditOutlined />
          修改密码
        </Item>
        <Item onClick={this.setting}>
          <SettingOutlined />
          设置
        </Item>
        <Menu.Divider />
        <Item key="logout" onClick={logout}>
          <LogoutOutlined />
          退出登录
        </Item>
      </Menu>
    );

    return (
      <div
        className={styles['user-menu']}
        ref={(node) => (this.userMenu = node)}
      >
        <Dropdown
          trigger="click"
          overlay={menu}
          getPopupContainer={() => this.userMenu || document.body}
          // style={{ fontSize: '12px' }}
        >
          <span className={styles['account']}>
            <span className={styles['user-name']}>
              {userInfo.name}({userInfo.staffId})&nbsp;
              {userInfo.role === 'student'
                ? '学生'
                : userInfo.role === 'teacher'
                ? '老师'
                : '管理员'}
            </span>
            <CaretDownOutlined />
          </span>
        </Dropdown>

        <div>
          <Modal
            visible={this.state.showModal}
            title="修改密码"
            onCancel={this.closeModal}
            okText="确认"
            cancelText="取消"
            // style={{ width: '1000' }}
            width="350px"
            bodyStyle={{ height: '220px', overflowY: 'auto' }}
            footer={null}
            destroyOnClose={true}
          >
            <ModifyPwdForm handleSubmit={this.handleSubmit}></ModifyPwdForm>
          </Modal>
        </div>

        <div>
          <Modal
            visible={this.state.showSettingModal}
            title="设置"
            onCancel={this.closeSettingModal}
            okText="确认"
            cancelText="取消"
            // style={{ width: '1000' }}
            width="350px"
            bodyStyle={{ height: '320px', width: '350px', overflowY: 'auto' }}
            footer={null}
            destroyOnClose={true}
          >
            <SettingForm
              id={this.props.userInfo.id}
              modifySuccess={this.modifySuccess}
            ></SettingForm>
          </Modal>
        </div>
      </div>
    );
  }
}
