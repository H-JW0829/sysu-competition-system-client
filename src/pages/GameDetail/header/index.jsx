import React, { Component } from 'react';
import { Tag } from 'antd';
import styles from './style.less';

export default class Header extends Component {
  render() {
    const { title, status, teamNum, startTime, endTime, min, max } = this.props;
    return (
      <div className={styles['container']}>
        <div className={styles['name']}>
          <div className={styles['key']}>比赛名称</div>
          <div className={styles['value']}>{title}</div>
        </div>
        <div className={styles['status']}>
          <div className={styles['key']}>状态</div>
          <div className={styles['value']}>
            <Tag
              color="#87d068"
              style={{ width: '70px', fontSize: '16px', padding: '3px' }}
            >
              {status == 0 ? '未开始' : status == 1 ? '进行中' : '已结束'}
            </Tag>
          </div>
        </div>
        <div className={styles['teams']}>
          <div className={styles['key']}>参赛队伍</div>
          <div className={styles['value']}>{teamNum}</div>
        </div>
        <div className={styles['peoples']}>
          <div className={styles['key']}>人数限制</div>
          {min === max ? (
            <div className={styles['value']}>{min}人</div>
          ) : (
            <div className={styles['value']}>{`${min}-${max}人`}</div>
          )}
        </div>
        <div className={styles['time']}>
          <div className={styles['key']}>开始时间</div>
          <div className={styles['value']}>{startTime}</div>
        </div>
        <div className={styles['time']}>
          <div className={styles['key']}>结束时间</div>
          <div className={styles['value']}>{endTime}</div>
        </div>
      </div>
    );
  }
}
