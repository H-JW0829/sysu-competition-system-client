import React, { Component } from 'react';
import { Upload, message, Button, Modal, Result } from 'antd';
import {
  InboxOutlined,
  ExclamationCircleOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import styles from './style.less';
import { get, post } from '../../../commons/http';
import { STATUS } from '../../../commons/config';

const { Dragger } = Upload;
const { confirm } = Modal;

export default class Submit extends Component {
  state = {
    fileList: [],
    teamId: '',
    competitionId: '',
  };

  componentDidMount() {
    if (
      this.props.teamId !== '' &&
      JSON.stringify(this.props.competition) !== '{}'
    ) {
      const getAppendix = async () => {
        const response = await post('/competition/getAppendix', {
          competitionId: this.props.competition._id,
          teamId: this.props.teamId,
        });
        const { code, data } = response;
        if (data.code === 0) {
          let fileList = [];
          const { uid, name, url, _id } = data.appendix;
          let file = { uid, name, url, _id, status: 'done' };
          fileList.push(file);
          this.setState({ fileList });
        }
      };
      getAppendix();
    }
  }

  handleChange = async (info) => {
    const fileUrl = info.file?.response?.data?.url;
    if (fileUrl) {
      let fileList = [];
      let file = {
        uid: info.file.uid,
        name: info.file.name,
        url: fileUrl,
        status: 'done',
        _id: this.state.fileList[0]?._id,
      };
      if (this.state.fileList.length > 0) {
        //删除之前的file
        const cdnResponse = await post(
          `http://localhost:3000/uploadToGuochuangyun?s=App.CDN.Delete&app_key=5687BCD24AA4D3C1ED073F5C8AC17C6B&url=${this.state.fileList[0].url}`,
          {},
          true
        );
        fileList.push(file);
        this.setState({ fileList });
        const response = await post(`/competition/updateAppendix`, {
          newAppendix: {
            name: info.file.name,
            url: fileUrl,
            fileType: info.file.type,
            uid: info.file.uid,
            size: info.file.size,
            id: this.state.fileList[0]._id,
          },
        });
        if (response.code === 0) {
          message.success('上传成功', 1);
        } else {
          message.error('上传失败', 1);
        }
      } else {
        //提交作品
        const response = await post(`/competition/submitAppendix`, {
          competitionId: this.props.competition._id,
          teamId: this.props.teamId,
          newAppendix: {
            name: info.file.name,
            url: fileUrl,
            fileType: info.file.type,
            uid: info.file.uid,
            size: info.file.size,
          },
        });
        if (response.code === 0) {
          file._id = response.data.appendix._id;
          fileList.push(file);
          this.setState({ fileList });
          message.success('上传成功', 1);
        } else {
          message.error('上传失败', 1);
        }
      }
    }
  };

  removeFile = (info) => {
    const _this = this;
    confirm({
      title: '您确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const deleteFile = async () => {
          const cdnResponse = await post(
            `http://localhost:3000/uploadToGuochuangyun?s=App.CDN.Delete&app_key=5687BCD24AA4D3C1ED073F5C8AC17C6B&url=${info.url}`,
            {},
            true
          );
          if (cdnResponse.ret === 200) {
            //cdn删除成功，删除数据库
            const response = await post('/competition/deleteAppendix', {
              appendixId: _this.state.fileList[0]._id,
            });
            if (response.code === 0) {
              message.success('删除成功', 1);
              _this.setState({ fileList: [] });
            } else {
              message.warning('删除失败，请稍后尝试', 1);
            }
          } else {
            message.warning('删除失败，请稍后尝试', 1);
          }
        };
        deleteFile();
      },
    });
  };

  render() {
    const { isCaptain, appendix, competition, status } = this.props;
    return status === STATUS.SIGNUP ? (
      isCaptain ? (
        <div>
          <Dragger
            accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.html,.log,.key,.numbers,.pages,.zip,.tar,.rar,.css,.js,.stp,.igs,.dwg"
            method="post"
            action="http://localhost:3000/uploadToGuochuangyun?s=App.CDN.UploadOffice&app_key=5687BCD24AA4D3C1ED073F5C8AC17C6B&sign=wtOVTtR1veX4VVwgSkYMf0Ur9YVHsifAhGl55hbXMrQbwGKWkPmBAEHoo5ydejQncZWI5b"
            onChange={this.handleChange}
            fileList={this.state.fileList}
            onRemove={this.removeFile}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或者拖拽文件进行上传</p>
          </Dragger>
        </div>
      ) : (
        <Result
          icon={<SmileOutlined />}
          title="你不是队长，没有提交作品的权限"
        ></Result>
      )
    ) : (
      <Result status="404" title="404" subTitle="走丢了..." />
    );
  }
}
