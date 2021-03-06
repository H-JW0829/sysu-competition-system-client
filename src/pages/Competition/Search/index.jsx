import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './style.less';

const { Option } = Select;

class Search extends Component {
  handleSearch = (values) => {
    if (!values.keyword) return;
    this.props.handleSearch(values.keyword);
  };

  handleReset = () => {
    this.form.resetFields(); //清空表单
    this.props.handleSearch('');
  };

  render() {
    const { styles } = this.props;
    return (
      <div
        style={{
          backgroundColor: '#fff',
          display: 'flex',
          paddingTop: '20px',
          paddingBottom: '10px',
          paddingLeft: '5px',
          ...styles,
        }}
      >
        <Form
          layout="inline"
          onFinish={this.handleSearch}
          ref={(form) => {
            this.form = form;
          }}
        >
          <Form.Item name="keyword">
            <Input
              style={{ width: 150 }}
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入关键字"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={this.handleReset}
          style={{ marginRight: '17px' }}
        >
          重置
        </Button>
      </div>
    );
  }
}

export default Search;
