import { createStore, applyMiddleware, compose } from "redux";
import Thunk from "redux-thunk";
import reducers from "./reducer";
import * as reduxThunk from "redux-thunk";
import { createBrowserHistory as createHistory } from "history";

import { routerMiddleware } from "react-router-redux";
export const history = createHistory();

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(reducers,
//     composeEnhancers(applyMiddleware(Thunk))
// )

// export default store;
const middleware = [reduxThunk.default, routerMiddleware(history)];
const enhancers = [];

const saveState = (state) => {
    const stateObject = {
        login_user: state["login_user"],
    };
    try {
        var serializedState = JSON.stringify(stateObject);
        sessionStorage.setItem("state", serializedState);
    } catch (error) {}
};

const loadState = () => {
    try {
        var serializedState = JSON.parse(sessionStorage.getItem("state"));
        if (serializedState) {
            return serializedState;
        }
    } catch (error) {
        return null;
    }
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);
const store = createStore(
    reducers,
    loadState(),
    composeEnhancers(applyMiddleware(Thunk))
);

store.subscribe(() => {
    saveState(store.getState());
});
export default store;
