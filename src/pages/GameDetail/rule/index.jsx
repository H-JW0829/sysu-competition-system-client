import React, { Component } from 'react';
import styles from './style.less';

export default class Rule extends Component {
  render() {
    const { content, fileList } = this.props.competition; //获取赛制内容和附件列表
    return (
      <div>
        {/* 渲染HTML字符串 */}
        <div
          style={{ minHeight: '430px' }}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        <div style={{ marginLeft: '10px' }}>
          {fileList
            ? fileList.map((file) => {
                return (
                  <div>
                    <a href={file.url} download={file.name}>
                      {file.name}
                    </a>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}
