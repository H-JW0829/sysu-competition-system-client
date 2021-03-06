import React, { Component } from 'react';
import Side from '../../components/side';
import CompetitionList from '../../pages/CompetitionList';
import styles from './style.less';
import { get, post } from '../../commons/http';
import { connect } from 'react-redux';
import { updateCompetitionInfo } from '../../store/competition/action';
import Search from './Search';

const dataSource = [
  {
    key: 'competition',
    text: '竞赛',
    icon: 'book',
    path: '',
    children: [
      {
        key: 'all',
        text: '所有',
        icon: 'align-left',
        path: '/home/competition/all',
      },
      {
        key: 'active',
        text: '进行中',
        icon: 'align-left',
        path: '/home/competition/active',
      },
      {
        key: 'before',
        text: '未开始',
        icon: 'align-left',
        path: '/home/competition/before',
      },
      {
        key: 'after',
        text: '已结束',
        icon: 'align-left',
        path: '/home/competition/after',
      },
    ],
  },
  {
    key: 'my',
    text: '我的',
    icon: 'user',
    path: '',
    children: [
      {
        key: 'signUp',
        text: '已报名',
        icon: 'align-left',
        path: '/home/competition/my',
      },
    ],
    // order: 900,
  },
];

class Competition extends Component {
  state = {
    allCompetitions: [],
    signUpCompetition: [],
    competitions: [],
    keyword: '',
  };

  componentDidMount() {
    const getSignUpCompetition = async () => {
      const { data, code } = await get('/user/getSignUpCompetition');
      if (code === 0) {
        let signUpCompetition = [];
        for (let i = 0; i < data.signUpCompetition.length; i++) {
          signUpCompetition.push(data.signUpCompetition[i].competition);
        }
        this.setState({ signUpCompetition });
      }
    };

    const getAllCompetitions = async () => {
      const response = await get('/competition/all');
      this.props.updateCompetition(response.data.competitions);
      this.setState({ allCompetitions: response.data?.competitions });
    };

    getAllCompetitions();
    getSignUpCompetition();
  }

  getCompetitions = () => {
    const tag = this.props.match.params.tag;
    const { allCompetitions, signUpCompetition } = this.state;
    if (tag === 'all') return allCompetitions;
    if (tag === 'my') return signUpCompetition;
    const status = tag == 'before' ? 0 : tag == 'active' ? 1 : 2;
    return allCompetitions.filter((competition) => {
      return competition.status == status;
    });
  };

  handleSearch = (keyword) => {
    this.setState({ keyword });
  };

  render() {
    const { keyword } = this.state;
    let competitions = this.getCompetitions();
    if (keyword !== '') {
      competitions = competitions.filter((competition) => {
        return (
          competition.title.includes(keyword) ||
          competition.desc.includes(keyword)
        );
      });
    }
    return (
      <div className={styles['page-container']}>
        <Side sideWidth={210} menus={dataSource} style={{ top: '50px' }} />
        <div className={styles['competition-list']}>
          <Search
            styles={{ marginLeft: '6px' }}
            handleSearch={this.handleSearch}
          ></Search>
          <CompetitionList
            tag={this.props.match.params.tag}
            competitions={competitions}
          ></CompetitionList>
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
      updateCompetition: (data) => {
        dispatch(updateCompetitionInfo(data));
      },
    };
  }
)(Competition);
