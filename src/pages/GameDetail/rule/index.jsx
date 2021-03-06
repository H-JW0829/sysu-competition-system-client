import React, { Component } from 'react';
import styles from './style.less';

export default class Rule extends Component {
  render() {
    const { content } = this.props.competition;
    return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
  }
}
