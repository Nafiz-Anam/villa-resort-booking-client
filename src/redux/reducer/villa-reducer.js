import { ActionType } from "../constant/action-type";

const intialState = {
    "isLoading":true,
    "data":[],
    "searchVilla":{},
    "villadetail": {
        "data":null
    },
    "destVilla":null,
    "alldest":[],
    "villaReview":[],
    "similarvilla":[]
    
}
const recentReview={}
const userRating={}
const villaRating={}
const destRating={}
const searchdata={
    
    destination:"",
    guest:1,
    startdate:null,
    enddate:null,
    kidsCount: 0,
    petsCount: 0,
    parentsCount: 0
    
}
const bookedDate=[]
const questionData = []
export const villaReducer = (state = intialState,action) => {
    const {type,payload}=action;
    switch (type) {
        case ActionType.GET_VILLA:
            return {...state,...payload}
            
        case ActionType.SET_VILLA:
            return {
                ...state,
                villadetail:payload
            }
        case ActionType.SEARCH_VILLA:
            return {
                ...state,
                searchVilla:payload,
                isLoading:false
            }
        case ActionType.DEST_VILLA:
            return {
                ...state,
                destVilla:payload
            }
        case ActionType.SET_DEST:
            return {
                ...state,
                alldest:payload
            }
        case ActionType.ADD_VILLA_REVIEW:
            return {
                    ...state,
                    villaReview:[...payload]
                }
        case ActionType.GET_VILLA_REVIEW:
            return {
                ...state,
                villaReview:payload
            }

        case ActionType.SIMILAR_VILLA:
            return {...state,
                similarvilla:payload}
            
        default:
           return state;
    }
}

export const searchReducer = (state=searchdata,action)  => {
    const {type,payload}=action
    switch (type) {
        case ActionType.SEARCH_DATA:
            return {
                ...state,
                ...payload
            }
    
        default:
            return state
    }
}

export const questionReducer = (state=questionData,action) => {
 const {type,payload}   =action
 switch(type){
     case ActionType.GET_QUESTION:
         return payload


    default:
        return state
 }
}

export const getUserRating = (state=userRating,action) => {
    const {type,payload} = action
    switch (type) {
        case ActionType.USER_RATING:
            return {...payload}
    
        default:
            return state
    }
}

export const getVillaRating = (state =villaRating,action) => {
    const {type,payload} = action
    switch (type) {
        case ActionType.GET_RATING:
            return {...payload}
    
        default:
            return state
    }
}

export const getRecentReview = (state =recentReview,action) => {
    const {type,payload} = action
    switch (type) {
        case ActionType.RECENT_REVIEW:
            return {...payload}
    
        default:
            return state
    }
}


export const getDestReview = (state=destRating,action) => {
    const {type,payload} = action
    switch (type) {
        case ActionType.DEST_REVIEW:
            return {...payload}
    
        default:
            return state
    }
}

export const setBookedDateReducer = (state=bookedDate,action) => {
    const {type,payload} = action
    switch(type){
        case ActionType.BOOKED_DATES:
            return payload
        default:
            return state
    }
}