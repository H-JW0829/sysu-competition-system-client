export const BASE_URL = 'http://localhost:8000/api';
export const api = {};

//0未开始 disabled button 1未报名 button 2提交作品 upload 3查看作品 button 4结束 button
export const STATUS = {
  BEFORE: 0,
  UN_SIGNUP: 1,
  SIGNUP: 2,
  SCORE: 3,
  END: 4,
};

export const SIDE_PATH = {
  RULE: 'rule',
  MARK: 'mark',
  SCORE: 'score',
  SUBMIT: 'submit',
};

export const SCORE_TEACHER_SIDE = [
  {
    key: 'rule',
    text: '赛制',
    icon: 'book',
    path: SIDE_PATH.RULE,
  },
  {
    key: 'mark',
    text: '评分',
    icon: 'edit',
    path: SIDE_PATH.MARK,
  },
  {
    key: 'score',
    text: '成绩',
    icon: 'user',
    path: SIDE_PATH.SCORE,
  },
];

export const SIGNUP_SIDE = [
  {
    key: 'rule',
    text: '赛制',
    icon: 'book',
    path: SIDE_PATH.RULE,
  },
  {
    key: 'submit',
    text: '提交',
    icon: 'snippets',
    path: SIDE_PATH.SUBMIT,
  },
  {
    key: 'score',
    text: '成绩',
    icon: 'user',
    path: SIDE_PATH.SCORE,
  },
  // {
  //   key: 'mark',
  //   text: '评分',
  //   icon: 'edit',
  //   path: SIDE_PATH.MARK,
  // },
];

export const UN_SIGNUP_SIDE = [
  {
    key: 'rule',
    text: '赛制',
    icon: 'book',
    path: SIDE_PATH.RULE,
  },
  {
    key: 'score',
    text: '成绩',
    icon: 'user',
    path: SIDE_PATH.SCORE,
  },
  // {
  //   key: 'mark',
  //   text: '评分',
  //   icon: 'edit',
  //   path: SIDE_PATH.MARK,
  // },
];

export const BEFORE_SIDE = [
  {
    key: 'rule',
    text: '赛制',
    icon: 'book',
    path: SIDE_PATH.RULE,
  },
  // {
  //   key: 'mark',
  //   text: '评分',
  //   icon: 'edit',
  //   path: SIDE_PATH.MARK,
  // },
];
