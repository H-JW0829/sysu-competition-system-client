import React, { Component } from 'react';
import { get, post } from '../../../commons/http';
import { Table, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { STATUS } from '../../../commons/config';

export default class Score extends Component {
  columns = [
    {
      title: '排名',
      key: 'rank',
      dataIndex: 'rank',
    },
    {
      title: '队伍',
      key: 'team',
      dataIndex: 'team',
    },
    {
      title: '分数',
      key: 'score',
      dataIndex: 'score',
    },
  ];

  state = {
    rank: [],
    pageNum: 1,
    pageSize: 5,
  };

  componentDidMount() {
    const { competition } = this.props;
    if (competition._id) {
      const getRank = async () => {
        const response = await post('/competition/getRank', {
          competitionId: competition._id,
        });
        if (response.code === 0) {
          this.setState({ rank: response.data.rank });
        }
      };

      getRank();
    }
  }

  pageSizeChange = (currentPage, pageSize) => {
    this.setState({ pageNum: currentPage, pageSize });
  };

  changePage = (currentPage) => {
    this.setState({ pageNum: currentPage });
  };

  render() {
    const { rank, pageNum, pageSize } = this.state;
    const { status } = this.props;
    return status !== STATUS.BEFORE ? (
      rank.length === 0 ? (
        <Result
          icon={<SmileOutlined />}
          title="成绩正在统计中，请耐心等候"
        ></Result>
      ) : (
        <div style={{ backgroundColor: '#fff' }}>
          <Table
            columns={this.columns}
            // dataSource={dataSource}
            dataSource={rank}
            pagination={{
              current: pageNum,
              pageSize: pageSize,
              // hideOnSinglePage: true,
              showQuickJumper: true,
              showSizeChanger: true,
              onShowSizeChange: (currentPage, pageSize) =>
                this.pageSizeChange(currentPage, pageSize),
              onChange: (currentPage) => this.changePage(currentPage),
              hideOnSinglePage: true,
            }}
          />
        </div>
      )
    ) : (
      <Result status="404" title="404" subTitle="走丢了..." />
    );
  }
}
