import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUser, logoutUser } from "../redux/action/login-action";
import { removeBooking, removeUserRating } from "../redux/action/villa-action";
import Home from "./Home";

function Logout(props) {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    useEffect(() => {
        props.logoutuser(null);
        props.removebooking();
        props.removerating();
    });
    return (
        <div>
            <Redirect from="/logout" to="/" />
        </div>
    );
}

// export default Logout;
const mapStateToProps = (state) => ({ user: state.login_user });

const mapDispatchToprops = (dispatch) => {
    return {
        logoutuser: (data) => dispatch(logoutUser(null)),
        removebooking: () => dispatch(removeBooking()),
        removerating: () => dispatch(removeUserRating()),
    };
};
// export default connect(null,{loginUser})(Login)
export default connect(mapStateToProps, mapDispatchToprops)(Logout);
