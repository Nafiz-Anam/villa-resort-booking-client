import http from "../http-common";

const header = localStorage.getItem("token");
if (header == null) {
}
const loginuser = (data) => {
    return http.post("/accounts/verify/otp", data);
};
// {code missing }

const detailVilla = (data) => {
    return http.post("/villa/view/detail/user", data);
};
const bookVilla = (data, headers) => {
    return http.post("/book/villa", data, { headers: headers });
};
const getVillaBooking = (data, headers) => {
    return http.post("/book/villa/user/booking", data, { headers: headers });
};
const getDestination = () => {
    return http.get("/villa/dest/view");
};
const getDestinationVilla = (data) => {
    console.log(data, "search data");
    return http.post("/villa/view/destination", data);
};
const getVillBySearch = (data) => {
    return http.post("/villa/filter", data);
};
const getAll = () => {
    return http.get("/blog/view");
};
const create = (data) => {
    return http.post("/blog/view", data);
};
const update = (id, data) => {
    return http.put("/blog/view", data);
};

const remove = (id) => {
    return http.delete("/blog/view");
};

const addVillaReviewRequest = (data) => {
    // console.log("reqdata",data)
    return http.post("/villa/review/view", data);
};

const getVillaReview = (data) => {
    return http.post("/villa/review/by/villa", data);
};
const validateVilla = (data) => {
    return http.post("/villa/view/validate", data);
};
const updateProfile = (data, header) => {
    return http.post("/accounts/update/user", data, { headers: header });
};
const getQuestion = () => {
    return http.get("/villa/question/active");
};
const addBookmark = (data, header) => {
    return http.post("/villa/bookmark/view", data, { headers: header });
};
const checkBookmark = (data, header) => {
    return http.post("/villa/bookmark/check", data, { headers: header });
};
const removeBookmark = (data, header) => {
    return http.post("/villa/bookmark/remove", data, { headers: header });
};
const addRating = (data, headers) => {
    return http.post("/villa/addrating", data, { headers: headers });
};
const getUserRating = (data, headers) => {
    return http.post("/villa/userrating", data, { headers: headers });
};
const getRating = (data) => {
    return http.post("/villa/getrating", data);
};

const recentReview = () => {
    return http.get("/villa/review/recent");
};

const destRecentReview = (data) => {
    return http.post("/villa/review/destination", data);
};

const similarVilla = (data) => {
    return http.post("/villa/view/similar", data);
};

const validateCouponCode = (data) => {
    return http.post("/villa/coupon/validate", data);
};

const getBlogs = (data) => {
    return http.post("/villa/blog/front", data);
};
const villaService = {
    getAll,
    create,
    update,
    remove,
    loginuser,
    sendLoginOtp,
    registerUser,
    sendRegisterOtp,
    getVilla,
    detailVilla,
    bookVilla,
    getVillaBooking,
    getVillBySearch,
    getDestination,
    getDestinationVilla,
    addVillaReviewRequest,
    getVillaReview,
    validateVilla,
    updateProfile,
    getQuestion,
    addBookmark,
    checkBookmark,
    removeBookmark,
    addRating,
    getUserRating,
    getRating,
    recentReview,
    destRecentReview,
    similarVilla,
    loginuser_with_google,
    loginuser_with_facebook,
    validateCouponCode,
    getBlogs,
};

export default villaService;
