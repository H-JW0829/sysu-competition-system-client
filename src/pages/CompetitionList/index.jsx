import React, { Component } from 'react';
import SingleCompetition from '../../components/single_competition';
import styles from './style.less';
import { Pagination } from 'antd';

export default class CompetitionList extends Component {
  state = {
    pageSize: 5, //页面数据量
    pageNum: 1, //当前页码
  };

  onChange = (num) => {
    this.setState({ pageNum: num }); //用户点击页码时的回调
  };

  render() {
    const { pageNum, pageSize } = this.state;
    const { competitions } = this.props;
    return (
      <div className={styles['competition-list']}>
        {competitions
          .slice((pageNum - 1) * pageSize, pageNum * pageSize)
          .map((competition, index) => {
            return (
              <div className={styles['single-game']} key={index}>
                <SingleCompetition
                  competition={competition}
                ></SingleCompetition>
              </div>
            );
          })}
        <div className={styles['pagination-container']}>
          <Pagination
            showQuickJumper
            total={competitions.length}
            current={pageNum}
            pageSize={pageSize}
            onChange={this.onChange}
            hideOnSinglePage={true}
          />
        </div>
      </div>
    );
  }
}
