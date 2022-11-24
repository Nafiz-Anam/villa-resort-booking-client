import {combineReducers} from 'redux'

import { BookingReducer, bookReducer } from './book-reducer';
import { loginReducer } from './userReducer'
import { getDestReview, getRecentReview, getUserRating, getVillaRating, questionReducer, searchReducer, setBookedDateReducer, villaReducer } from './villa-reducer';

const reducers = combineReducers( {
    login_user:loginReducer,
    villa:villaReducer,
    bookData:bookReducer,
    bookingDetail:BookingReducer,
    searchdata:searchReducer,
    question:questionReducer,
    userrating:getUserRating,
    villarating:getVillaRating,
    recentreview:getRecentReview,
    destReview:getDestReview,
    bookedDate:setBookedDateReducer
})

export default reducers;