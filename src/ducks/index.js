import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import mainReducer from './reducer';
import mainSaga from './saga';

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  mainReducer,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(mainSaga);

export default store;
export {
  incrementAsync,
  activateStart,
  activateStop,
} from './action';
