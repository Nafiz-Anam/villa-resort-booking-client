import villaService from "../../services/service";
import { ActionType } from "../constant/action-type";

export const loginUser = (data) => async (dispatch) => {
    try {
        const res = await villaService.loginuser(data);

        dispatch({
            type: ActionType.LOGIN_USER,
            payload: res.data,
        });
        return Promise.resolve(res.data);
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
};

export const loginWithFacebook = (data) => async (dispatch) => {
    try {
        const res = await villaService.loginuser_with_facebook(data);

        dispatch({
            type: ActionType.LOGIN_USER,
            payload: res.data,
        });
        return Promise.resolve(res.data);
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
};

export const loginWithGoogle = (data) => async (dispatch) => {
    try {
        const res = await villaService.loginuser_with_google(data);

        dispatch({
            type: ActionType.LOGIN_USER,
            payload: res.data,
        });
        return Promise.resolve(res.data);
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
};

export const registerUser = (data) => async (dispatch) => {
    try {
        const res = await villaService.registerUser(data);
        dispatch({
            type: ActionType.LOGIN_USER,
            payload: res.data,
        });
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const logoutUser = (data) => async (dispatch) => {
    let state = sessionStorage.getItem("state");
    let bdata = JSON.stringify({
        bookingDetail: {},
        userrating: { data: null },
    });
    sessionStorage.setItem("state", { ...state, bdata });
    try {
        dispatch({
            type: ActionType.LOGIN_USER,
            payload: null,
        });
    } catch (err) {
        console.log(err);
    }
};

export const updateUser = (data, headers) => async (dispatch) => {
    const res = await villaService.updateProfile(data, headers);
    if (res.data.status) {
        try {
            dispatch({
                type: ActionType.LOGIN_USER,
                payload: res.data,
            });
            return Promise.resolve(res.data);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            return Promise.resolve(res.data);
        } catch (err) {
            console.log(err);
        }
    }
};
