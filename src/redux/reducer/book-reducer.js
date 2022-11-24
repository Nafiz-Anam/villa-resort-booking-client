import { ActionType } from "../constant/action-type";

export const bookReducer = (state = {}, action) => {
    const { type, payload } = action;
    switch (type) {
        case ActionType.BOOK_VILLA:
            return {
                ...state,
                ...payload,
            };
        case ActionType.RESET_BOOK:
            return {};

        default:
            return state;
    }
};

// export const resetBookReducer = (state={},action) => {
//     const {type,payload}=action
//     switch(type){
//         case ActionType.BOOK_VILLA:
//             return payload
//         default:
//             return state
//     }

// }
export const BookingReducer = (state = {}, action) => {
    const { type, payload } = action;
    switch (type) {
        case ActionType.VILLA_BOOKING:
            return {
                ...state,
                payload,
            };

        default:
            return state;
    }
};
