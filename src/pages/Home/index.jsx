import React, { Component } from 'react';
import { NavLink, Link, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { get, post } from '../../commons/http';
import Header from '../../components/header';
import styles from './style.less';
import NotFound from '../NotFound';
import { updateUserInfo } from '../../store/user/action';
import { message } from 'antd';

const NavItems = [
  {
    text: '竞赛列表',
    id: 1,
    path: '/home/competition',
  },
  {
    text: '我的报名',
    id: 2,
    path: '/home/sign-up',
  },
];
class Home extends Component {
  state = {
    showIndex: -1,
  };

  componentDidMount() {
    const getUserInfo = async () => {
      const response = await get('/user/get-info');
      if (response.code === 0) {
        window.localStorage.setItem(
          'user',
          JSON.stringify({ ...response.data })
        );
        this.props.updateUser({
          name: response.data.name,
          id: response.data.id,
          role: response.data.role,
          tel: response.data.tel,
          staffId: response.data.staffId,
        });
      } else {
        message.error('用户信息获取失败', 1);
        this.props.history.push('/login');
      }
    };

    // getAllCompetition();
    getUserInfo();
  }

  handleLinkClick = (index) => {
    this.setState({ showIndex: index });
  };

  render() {
    const { match, userInfo } = this.props;
    return (
      <div className={styles['page-container']}>
        <Header userInfo={userInfo}></Header>
        <div className={styles['page-content']}>
          <Switch>
            {this.props.routes.map((route, index) => {
              if (route.exact) {
                return (
                  <Route
                    key={index}
                    path={`${match.path}${route.path}`}
                    exact
                    render={(props) => (
                      <route.component {...props} routes={route.routes} />
                    )}
                  />
                );
              } else {
                return (
                  <Route
                    key={index}
                    path={`${match.path}${route.path}`}
                    render={(props) => (
                      <route.component {...props} routes={route.routes} />
                    )}
                  ></Route>
                );
              }
            })}
            {/* <Redirect from="/home" to="/home/users" exact></Redirect> */}
            <Redirect from="/home" to="/home/competition/all" exact></Redirect>
            <Redirect
              from="/home/competition"
              to="/home/competition/all"
              exact
            ></Redirect>
            <Route path="/home/*" component={NotFound}></Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    const { userInfo } = state;
    return { userInfo };
  },
  (dispatch) => {
    return {
      updateUser: (data) => {
        dispatch(updateUserInfo(data));
      },
    };
  }
)(Home);
