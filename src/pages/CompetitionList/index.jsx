import React, { Component } from 'react';
import SingleCompetition from '../../components/single_competition';
import styles from './style.less';
import { Pagination } from 'antd';

export default class CompetitionList extends Component {
  state = {
    pageSize: 5,
    pageNum: 1,
  };

  onChange = (num) => {
    this.setState({ pageNum: num });
  };

  render() {
    const { pageNum, pageSize } = this.state;
    const { competitions } = this.props;
    console.log(competitions, 'fffff');
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
            // showSizeChanger={true}
            // onShowSizeChange={}
          />
        </div>
      </div>
    );
  }
}
