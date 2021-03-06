import React, { Component } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { get, post } from '../../../commons/http';
import { publicEncrypt } from 'crypto';
const { Option } = Select;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 20, offset: 1 },
};

const tailLayout = {
  wrapperCol: { offset: 2, span: 20 },
};

export default class SettingForm extends Component {
  handleSubmit = (values) => {
    this.props.handleSubmit(values);
  };

  componentDidMount() {
    const fetchData = async () => {
      const { id } = this.props;
      console.log(id, 'rrrr');
      const response = await post('/user/getUserInfoById', {
        id,
      });
      this.setState({ user: response.data.user });
      this.form.setFieldsValue(response.data.user);
    };

    fetchData();
  }

  handleSubmit = async (values) => {
    const { name, tel, role, newPassword } = values;
    let rsaPassword;
    if (newPassword && newPassword !== '') {
      const publicKey = window.localStorage.getItem('publicKey');
      rsaPassword = publicEncrypt(publicKey, Buffer.from(newPassword)).toString(
        'base64'
      );
    }
    const user = {
      name,
      tel,
      role,
      _id: this.props.id,
      password: rsaPassword,
    };
    const response = await post('/user/userUpdateInfo', user);
    if (response.code === 0) {
      message.success('修改成功');
      window.localStorage.setItem('token', response.data.token);
      setTimeout(() => {
        this.props.modifySuccess(user);
      }, 1000);
    } else {
      message.error(response.msg || '修改失败，请稍后尝试');
    }
  };

  render() {
    return (
      <div>
        <Form
          ref={(form) => (this.form = form)}
          name="modifyPassword"
          onFinish={this.handleSubmit}
          {...layout}
        >
          <div>
            <Form.Item
              label="姓名"
              name="name"
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
              <Input />
            </Form.Item>

            <Form.Item label="联系方式" name="tel">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                // { required: true, message: '请输入密码' },
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
              <Input />
            </Form.Item>

            <Form.Item
              name="role"
              label="身份"
              rules={[{ required: true, message: '请选择身份' }]}
            >
              <Select placeholder="请选择身份" size="large">
                <Option value="student">学生</Option>
                <Option value="teacher">老师</Option>
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item
              shouldUpdate={true}
              style={{ marginBottom: 0 }}
              {...tailLayout}
            >
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    this.form
                      ?.getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                  style={{ width: '100%' }}
                >
                  确认
                </Button>
              )}
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}
