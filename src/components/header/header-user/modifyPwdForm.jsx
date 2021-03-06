import React, { Component } from 'react';
import { Menu, Dropdown, Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export default class ModifyPwdForm extends Component {
  handleSubmit = (values) => {
    this.props.handleSubmit(values);
  };

  render() {
    return (
      <div>
        <Form
          ref={(form) => (this.form = form)}
          name="modifyPassword"
          onFinish={this.handleSubmit}
        >
          <div>
            <Form.Item
              name="newPassword"
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
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>
          </div>
          <div>
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
                prefix={<LockOutlined />}
                placeholder="确认密码"
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item shouldUpdate={true} style={{ marginBottom: 0 }}>
              {() => (
                <Button
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
