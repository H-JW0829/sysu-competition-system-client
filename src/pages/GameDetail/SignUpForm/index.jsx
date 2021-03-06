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
    console.log(values, 'www');
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
                        { required: true, message: '???????????????' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const result = allUserInfo.find((item) => {
                              return value === item.staffId;
                            });
                            if (result) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject('??????????????????');
                            }
                          },
                        }),
                      ]}
                      label="??????"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'tel']}
                      fieldKey={[field.fieldKey, 'tel']}
                      rules={[
                        { required: true, message: '?????????????????????' },
                        {
                          message: '??????????????????????????????',
                          type: 'string',
                          len: 11,
                          pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                        },
                      ]}
                      label="????????????"
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
                    ????????????
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
              ??????
            </Button>
          </Form.Item>
        </Form>
        <div
          style={{ marginLeft: '8px', color: 'rgba(0,0,0,0.65)', opacity: 0.7 }}
        >
          <InfoCircleOutlined></InfoCircleOutlined>
          <span style={{ marginLeft: '5px' }}>????????????????????????????????????</span>
        </div>
      </div>
    );
  }
}
