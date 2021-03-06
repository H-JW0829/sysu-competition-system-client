import rootReducer from './rootReducer';
import { createStore, applyMiddleware } from 'redux';

// const initState = {
//   user: {
//     id: '111',
//     name: '',
//     tel: '',
//     role: '',
//   },
// };
export const store = createStore(rootReducer);
