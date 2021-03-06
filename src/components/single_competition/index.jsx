import React, { Component } from 'react';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import styles from './style.less';

export default class SingleCompetition extends Component {
  getRandomColor = () => {
    return (
      '#' +
      ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).slice(-6)
    );
  };

  componentDidMount() {}

  render() {
    let {
      content,
      desc,
      organizer,
      start_time,
      end_time,
      status,
      tags,
      title,
      team_num,
      _id,
    } = this.props.competition;
    // const startTime = start_time.slice(0, start_time.indexOf('T'));
    return (
      <div className={styles['container']}>
        <div className={styles['header']}>
          <Link
            to={`/home/game-detail/${_id}/rule`}
            style={{ font: "400 22px 'Gotham'" }}
          >
            {title}
          </Link>
          {tags.map((tag, index) => {
            return (
              <Tag
                color={`${this.getRandomColor()}`}
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  left: '15px',
                  top: '-4px',
                  borderRadius: '3px',
                }}
                key={index}
              >
                {tag}
              </Tag>
            );
          })}
        </div>
        <div className={styles['main']}>
          <div className={styles['desc']}>{desc}</div>
          <div className={styles['teams']}>
            <p className={styles['key']}>团队</p>
            <p className={styles['value']}>{team_num}</p>
          </div>
          <div className={styles['time']}>
            <p className={styles['key']}>时间</p>
            <p className={styles['value']}>{start_time}</p>
          </div>
          <div
            className={`${styles['status']} ${
              status == 0
                ? styles['before-status']
                : status == 1
                ? styles['in-status']
                : styles['after-status']
            }`}
          >
            <span>
              {status == 0 ? '未开始' : status == 1 ? '进行中' : '已结束'}
            </span>
          </div>
        </div>
        <div className={styles['footer']}>
          <span>举办方:{organizer}</span>
        </div>
      </div>
    );
  }
}
