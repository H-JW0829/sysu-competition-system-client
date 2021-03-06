import React, { Component } from 'react';
import { Form, Input, Button, Space, Tooltip, Icon } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import styles from './style.less';
import { get, post } from '../../../commons/http';

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 28, offset: 1 },
};
const tailLayout = {
  wrapperCol: { offset: 11, span: 20 },
};

export default class SignUpForm extends Component {
  state = {
    studentNum: 0,
  };

  handleSubmit = async (values) => {
    console.log(values);
    const users = values.users;
    for (let i = 0; i < users.length; i++) {
      users[i].isCaptain = false;
    }
    users[0].isCaptain = true;
    const response = await post('/competition/signUp', {
      users,
      competitionId: this.props.competitionId,
    });
    if (response.code == 0) {
      this.props.callback(true);
    } else {
      this.props.callback(false);
    }
  };

  addStudent = () => {
    const { studentNum } = this.state;
    this.setState({ studentNum: studentNum + 1 });
  };

  render() {
    const { allUserInfo, min_people, max_people } = this.props;
    return (
      <div className={styles['form-container']}>
        <Form
          name="dynamic_form_nest_item"
          autoComplete="off"
          {...layout}
          onFinish={this.handleSubmit}
        >
          <Form.List name="users" {...layout}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: 3,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'staffId']}
                      fieldKey={[field.fieldKey, 'staffId']}
                      validateFirst={true}
                      rules={[
                        { required: true, message: '请输入学号' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const result = allUserInfo.find((item) => {
                              return value === item.staffId;
                            });
                            if (result) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject('该学号未注册');
                            }
                          },
                        }),
                      ]}
                      label="学号"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'tel']}
                      fieldKey={[field.fieldKey, 'tel']}
                      rules={[
                        { required: true, message: '请输入联系方式' },
                        {
                          message: '请输入正确的手机号码',
                          type: 'string',
                          len: 11,
                          pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                        },
                      ]}
                      label="手机号码"
                    >
                      <Input />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      this.addStudent();
                      add();
                    }}
                    block
                    icon={<PlusOutlined />}
                    disabled={this.state.studentNum === max_people}
                  >
                    添加成员
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.studentNum < min_people}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
        <div
          style={{ marginLeft: '8px', color: 'rgba(0,0,0,0.65)', opacity: 0.7 }}
        >
          <InfoCircleOutlined></InfoCircleOutlined>
          <span style={{ marginLeft: '5px' }}>注意：第一个成员即为队长</span>
        </div>
      </div>
    );
  }
}
