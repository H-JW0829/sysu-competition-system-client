import Login from '../pages/Login';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
import SignUp from '../pages/SignUp';
import Competition from '../pages/Competition';
import GameDetail from '../pages/GameDetail';
import Rule from '../pages/GameDetail/rule';
import Mark from '../pages/GameDetail/mark';
import Submit from '../pages/GameDetail/submit';
import Score from '../pages/GameDetail/score';
import resetPwd from '../pages/resetPwd';
import { SIDE_PATH } from '../commons/config';

let routes = [
  {
    path: '/',
    component: Login,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/register',
    component: Register,
    exact: true,
  },
  {
    path: '/resetPwd',
    component: resetPwd,
    exact: true,
  },
  {
    path: '/home',
    component: Home,
    // exact: true,
    routes: [
      {
        path: '/competition/:tag',
        component: Competition,
        exact: true,
      },
      {
        path: '/sign-up',
        component: SignUp,
        exact: true,
      },
      {
        path: '/game-detail/:id',
        component: GameDetail,
        routes: [
          {
            path: `/${SIDE_PATH.RULE}`,
            component: Rule,
            // exact: true,
          },
          {
            path: `/${SIDE_PATH.SCORE}`,
            component: Score,
            // exact: true,
          },
          {
            path: `/${SIDE_PATH.SUBMIT}`,
            component: Submit,
            // exact: true,
          },
          {
            path: `/${SIDE_PATH.MARK}`,
            component: Mark,
            // exact: true,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    component: NotFound,
  },
];

export default routes;
