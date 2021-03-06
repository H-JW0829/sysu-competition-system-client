import React, { Component } from 'react';
import { Space, Table, Modal, Input, Button, message, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import styles from './style.less';
import { get, post } from '../../../commons/http';
import { STATUS } from '../../../commons/config';

export default class Mark extends Component {
  state = {
    dataSource: [],
    showScoreModal: false,
    score: -1,
    teamId: '',
    rowIndex: -1,
    pageNum: 1,
    pageSize: 5,
  };

  dataSource = [
    {
      key: '1',
      team: '湖人队',
      appendix: '啊啊啊啊',
      score: '-',
    },
    {
      key: '2',
      team: '勇士队',
      appendix: '啊啊啊啊',
      score: '-',
    },
  ];

  columns = [
    {
      title: '队伍',
      key: 'team',
      // dataIndex: 'team',
      render: (text, record) => {
        return (
          <Space size="middle">
            {/* <a onClick={() => this.edit(record._id)}>aaa</a> */}
            <span>{record.team.name}</span>
          </Space>
        );
      },
    },
    {
      title: '作品',
      key: 'appendix',
      render: (text, record) => {
        const { appendix } = record;
        return (
          <Space size="middle">
            {/* <a onClick={() => this.edit(record._id)}>aaa</a> */}
            <a href={appendix.url} download={appendix.name}>
              点击下载
            </a>
          </Space>
        );
      },
    },
    {
      title: '分数',
      key: 'score',
      dataIndex: 'score',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => {
        return (
          <Space size="middle">
            <a onClick={() => this.score(record.team.id, index)}>评分</a>
          </Space>
        );
      },
    },
  ];

  score = (id, index) => {
    this.setState({ showScoreModal: true, teamId: id, rowIndex: index });
  };

  scoreRef = React.createRef();

  componentDidMount() {
    const { competition } = this.props;
    console.log(this.props.competition, 'xxx');
    let dataSource = [];
    for (let i = 0; i < competition?.teams?.length; i++) {
      let row = { key: i };
      row.score =
        competition.teams[i].score === -1 ? '-' : competition.teams[i].score;
      row.appendix = {
        url: competition.teams[i].appendix?.url,
        name: competition.teams[i].appendix?.name,
      };
      let arr = [];
      for (let j = 0; j < competition.teams[i].users?.length; j++) {
        arr.push(competition.teams[i].users[j].user?.name);
      }
      let team = {};
      team.name = arr.join('、');
      team.id = competition.teams[i]._id;
      row.team = team;
      dataSource.push(row);
    }
    console.log(dataSource, 'sssss');
    this.setState({ dataSource });
  }

  submitScore = async () => {
    // console.log(this.scoreRef.current.state.value, 'eee');
    const score = Number(this.scoreRef.current.state.value);
    if (Object.is(score, NaN)) {
      message.warning('格式不正确', 1);
      return;
    }
    const response = await post('/competition/submitScore', {
      competitionId: this.props.competition._id,
      teamId: this.state.teamId,
      score,
    });
    if (response.code === 0) {
      message.success('评分成功', 1);
      const { rowIndex, dataSource } = this.state;
      const data = [...dataSource];
      data[rowIndex].score = score;
      this.setState({ dataSource: data });
      setTimeout(() => {
        this.setState({ showScoreModal: false });
      }, 500);
    } else {
      message.warning('评分失败，请稍后尝试', 1);
    }
  };

  closeScoreModal = () => {
    this.setState({ showScoreModal: false });
  };

  pageSizeChange = (currentPage, pageSize) => {
    this.setState({ pageNum: currentPage, pageSize });
  };

  changePage = (currentPage) => {
    this.setState({ pageNum: currentPage });
  };

  render() {
    const { dataSource, showScoreModal, score, pageSize, pageNum } = this.state;
    const { status } = this.props;
    return status === STATUS.SCORE ? (
      <div style={{ backgroundColor: '#fff' }}>
        <Table
          columns={this.columns}
          dataSource={dataSource}
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

        <div>
          <Modal
            visible={showScoreModal}
            title="评分"
            // onOk={this.handleOk}
            onCancel={this.closeScoreModal}
            // confirmLoading={this.state.confirmLoading}
            footer={false}
            width="350px"
            bodyStyle={{ height: '120px', overflowY: 'auto' }}
            destroyOnClose={true}
          >
            <Input
              ref={this.scoreRef}
              onChange={this.scoreChange}
              placeholder="请输入分数"
            />
            <Button
              style={{ marginTop: '8px', marginLeft: '117px' }}
              type="primary"
              onClick={this.submitScore}
            >
              确定
            </Button>
          </Modal>
        </div>
      </div>
    ) : (
      <Result status="404" title="404" subTitle="走丢了..." />
    );
  }
}
