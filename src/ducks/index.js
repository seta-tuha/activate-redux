import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import mainReducer from './reducer';
import mainSaga from './saga';

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
  typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware),
)


const store = createStore(
  mainReducer,
  enhancer
)

sagaMiddleware.run(mainSaga);
export default store;
export {
  incrementAsync,
  activateStart,
  activateStop,
} from './action';
