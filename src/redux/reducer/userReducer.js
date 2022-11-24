import { ActionType } from "../constant/action-type";

const initialState = {
    data: null,
    errmsg: "",
};

export const loginReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case ActionType.LOGIN_USER:
            return {
                ...state,
                data: payload,
            };

        case ActionType.ADD_USER:
            return {
                ...state,
                data: payload,
            };
        case ActionType.LOGOUT_USER:
            return {
                ...state,
                data: null,
            };
        default:
            return state;
    }
};
