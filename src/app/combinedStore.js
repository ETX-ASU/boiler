import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import appReducer from "./store/appReducer";
import modalReducer from "./store/modalReducer";
import gradingBarReducer from "../instructor/assignments/gradingBar/store/gradingBarReducer";
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    app: appReducer,
    gradingBar: gradingBarReducer,
    modal: modalReducer
  }
);

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(rootReducer, storeEnhancers(applyMiddleware(thunk)));