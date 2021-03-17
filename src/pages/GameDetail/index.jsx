import React, { Component } from 'react';
import { Button, Modal, message } from 'antd';
import Header from './header';
import styles from './style.less';
import SignUpForm from './SignUpForm';
import Side from '../../components/side';
import { connect } from 'react-redux';
import { get, post } from '../../commons/http';
import {
  SCORE_TEACHER_SIDE,
  SIGNUP_SIDE,
  UN_SIGNUP_SIDE,
  BEFORE_SIDE,
  STATUS,
} from '../../commons/config';
import _ from 'lodash';
import { NavLink, Link, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from '../NotFound';

// const dataSource = SCORE_TEACHER_SIDE;

class CompetitionDetail extends Component {
  state = {
    showSignUpModal: false,
    confirmLoading: false,
    competition: {},
    allUserInfo: [],
    isSignUp: false,
    status: STATUS.BEFORE, //0未开始 disabled button 1未报名 button 2提交作品 upload 3查看作品 button 4结束 button
    dataSource: [],
    isCaptain: false,
    appendix: {},
    teamId: '',
  };

  componentDidMount() {
    // console.log('811');
    // console.log(this.props.match.params.id);
    const user = JSON.parse(window.localStorage.getItem('user')); //获取用户信息
    const getCompetitionInfo = async () => {
      const response = await post(`/competition/find`, {
        competitionId: this.props.match.params.id,
      });
      // console.log('比赛信息', response);
      if (response.code === 0) {
        const id = response.data.competition?.score_teacher?._id;
        const competitionStatus = response.data.competition.status;
        let status = STATUS.BEFORE;
        if (competitionStatus == 0) {
          //未开始
          status = STATUS.BEFORE;
        } else if (competitionStatus == 1) {
          //进行中
          if (id === user.id) {
            //评分老师
            status = STATUS.SCORE;
          } else {
            //不是评分老师
            const isSignUp = async () => {
              let signUp = false;
              const { data } = await get('/user/getSignUpCompetition');
              for (let i = 0; i < data.signUpCompetition.length; i++) {
                if (
                  data.signUpCompetition[i].competition?._id ==
                  this.props.match.params.id
                ) {
                  //报名了
                  signUp = true;
                  let isCaptain = false;
                  let teamId = data.signUpCompetition[i].teamId;
                  // console.log(data.signUpCompetition[i].isCaptain, 'iiiii');
                  if (data.signUpCompetition[i].isCaptain) {
                    isCaptain = true;
                  }
                  this.setState({
                    isCaptain,
                    appendix: data.signUpCompetition[i].appendix,
                    teamId,
                  });
                  break;
                }
              }
              return signUp;
            };

            const signUp = await isSignUp();
            if (signUp) {
              //已报名
              status = STATUS.SIGNUP;
            } else {
              //未报名
              status = STATUS.UN_SIGNUP;
            }
          }
        } else if (competitionStatus == 2) {
          //已结束
          status = STATUS.END;
        }
        this.setState({ competition: response.data.competition, status });
      }
    };

    const getStudentId = async () => {
      const response = await get('/user/userInfo/student');
      const { code, data, msg } = response;
      // console.log(data);
      if (code == 0) {
        this.setState({ allUserInfo: data });
      }
    };

    getCompetitionInfo();
    getStudentId();
  }

  popModal = () => {
    const { status } = this.state;
    if (status === STATUS.UN_SIGNUP) {
      this.setState({ showSignUpModal: true });
    }
  };

  handleOk = () => {
    this.setState({ confirmLoading: true });
    setTimeout(() => {
      this.setState({ showSignUpModal: false, confirmLoading: false });
    }, 2000);
  };

  handleCancel = () => {
    this.setState({ showSignUpModal: false });
  };

  signUpCallback = (isSuccess) => {
    if (isSuccess) {
      let competition = { ...this.state.competition };
      competition.team_num += 1;
      this.setState({ competition, status: STATUS.SIGNUP });
      message.success('报名成功', 2);
      setTimeout(() => {
        this.setState({ showSignUpModal: false });
      }, 1000);
    } else {
      message.error('报名出错，请稍后尝试', 1);
    }
  };

  getDataSource = () => {
    const { status } = this.state;
    let side;
    // console.log(SIGNUP_SIDE, 'yyyyyy');
    if (status === STATUS.SIGNUP) {
      side = _.cloneDeep(SIGNUP_SIDE);
    } else if (status === STATUS.SCORE) {
      side = _.cloneDeep(SCORE_TEACHER_SIDE);
    } else if (status === STATUS.BEFORE) {
      side = _.cloneDeep(BEFORE_SIDE);
    } else {
      side = _.cloneDeep(UN_SIGNUP_SIDE);
    }
    // let result = [];
    for (let i = 0; i < side.length; i++) {
      side[i].path =
        '/home/game-detail/' + this.props.match.params.id + '/' + side[i].path;
    }
    return side;
  };

  render() {
    const {
      allUserInfo,
      competition,
      isCaptain,
      appendix,
      teamId,
    } = this.state;
    const {
      status,
      title,
      team_num,
      start_time,
      content,
      end_time,
      min_people,
      max_people,
    } = competition;
    console.log(this.state.status, 'uuu1');
    return (
      <div className={styles['container']}>
        <div className={styles['game-table']}>
          <Header
            status={status}
            title={title}
            teamNum={team_num}
            startTime={start_time}
            endTime={end_time}
            min={min_people}
            max={max_people}
          ></Header>
        </div>
        <div className={styles['signUp-container']}>
          <Button
            type="primary"
            style={{
              width: '80%',
              fontWeight: '600',
              fontSize: '16px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              height: '45px',
            }}
            onClick={this.popModal}
            disabled={this.state.status === STATUS.UN_SIGNUP ? false : true}
          >
            报名参赛
          </Button>
        </div>
        <div className={styles['content-container']}>
          <Side
            sideWidth={210}
            style={{
              position: 'absolute',
              left: '0',
              top: '-8px',
              height: '100%',
              //   backgroundColor: '#f8fafe',
            }}
            menus={this.getDataSource()}
          ></Side>
          <div className={styles['content']}>
            <Switch>
              {this.props.routes.map((route, index) => {
                if (route.exact) {
                  return (
                    <Route
                      key={index}
                      path={`${this.props.match.url}${route.path}`}
                      exact
                      component={(props) => (
                        <route.component
                          {...props}
                          routes={route.routes}
                          competition={competition}
                          isCaptain={isCaptain}
                          appendix={appendix}
                          teamId={teamId}
                          status={this.state.status}
                        />
                      )}
                    />
                  );
                } else {
                  return (
                    <Route
                      key={index}
                      path={`${this.props.match.url}${route.path}`}
                      component={(props) => (
                        <route.component
                          {...props}
                          routes={route.routes}
                          competition={competition}
                          isCaptain={isCaptain}
                          appendix={appendix}
                          teamId={teamId}
                          status={this.state.status}
                        />
                      )}
                    ></Route>
                  );
                }
              })}
              <Redirect
                from="/home/game-detail/:id"
                to={`/home/game-detail/${this.props.match.params.id}/rule`}
                exact
              ></Redirect>
              <Route path="/home/game-detail/*" component={NotFound}></Route>
            </Switch>
          </div>
        </div>
        <div>
          <Modal
            visible={this.state.showSignUpModal}
            title="报名表"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            confirmLoading={this.state.confirmLoading}
            okText="确认报名"
            cancelText="取消"
            width="830px"
            bodyStyle={{ height: '450px', overflowY: 'auto' }}
            footer={false}
            destroyOnClose
          >
            <SignUpForm
              min_people={min_people}
              max_people={max_people}
              allUserInfo={allUserInfo}
              competitionId={this.props.match.params.id}
              callback={this.signUpCallback}
            ></SignUpForm>
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    const { competitionInfo } = state;
    return { competitionInfo };
  },
  (dispatch) => {
    return {
      dispatch,
    };
  }
)(CompetitionDetail);
