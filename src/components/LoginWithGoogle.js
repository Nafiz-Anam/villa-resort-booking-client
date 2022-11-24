import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loginWithGoogle } from "../redux/action/login-action";
import "../App.css";
import swal from "sweetalert";

class LoginWithGoogle extends Component {
    responseGoogle = async (response) => {
        console.log(response);
        // { code missing }
    };
    responseFail = (response) => {
        console.log("fail", response);
    };

    render() {
        return (
            <GoogleLogin
                clientId="304964962689-i6dbr84i768pgp32o6krsber91jfdvg3.apps.googleusercontent.com"
                render={(renderProps) => (
                    <button
                        className="custom-btn google-button"
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                    >
                        <img src="/assets/images/google.png" alt="" />
                        &nbsp; Continue using Google
                    </button>
                )}
                onSuccess={this.responseGoogle}
                onFailure={this.responseFail}
                cookiePolicy={"single_host_origin"}
            />
        );
    }
}

const mapStateToProps = (state) => ({ user: state.login_user });
const mapDispatchToprops = (dispatch) => {
    return {
        loginuser: (data) => dispatch(loginWithGoogle(data)),
        // logoutuser: (data) => dispatch(logoutUser(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToprops
)(withRouter(LoginWithGoogle));
