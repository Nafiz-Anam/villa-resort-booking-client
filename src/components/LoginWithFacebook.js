import React, { Component } from "react";

// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  loginWithFacebook,
  loginWithGoogle,
} from "../redux/action/login-action";
import Popup from "reactjs-popup";
import swal from "sweetalert";

class LoginWithFacebook extends Component {
  state = {
    isPopUp: false,
    name: "show popup",
    email: "",
    response: {},
  };
  componentDidMount() {}
  responseFacebook = async (response) => {
    
    if (!response.email) {
      this.setState({ name: "Jay", isPopUp: true, respone: response });
    } else {
      this.sendData(response);
    }
  };
  loginwithfb = () => {
    let response = this.state.response;
    let obj = {
      name: response.name,
      email: this.state.email,
      tokenId: response.accessToken,
      id: response.id,
    };
    this.sendData(obj);
  };
  sendData = async (response) => {
    let obj = {
      name: response.name,
      email: response.email,
      tokenId: response.accessToken,
      id: response.id,
    };
    
    let res = await this.props.loginuser(obj);
    let { data } = this.props.user;
    
    if (data.status == true) {
      swal("User is Logged in Successfully","","success");
      localStorage.setItem("email", data.data.email);
      localStorage.setItem("token", data.data.token);

      this.props.history.goBack();
    } else {
      swal(data.message,"","error");
    }
  };
  onClickFacebookBtn = async () => {
    let response = this.state.respone;
    this.setState({ response: response });
    let obj = {
      name: response.name,
      email: this.state.email,
      tokenId: response.accessToken,
      id: response.id,
    };

    let res = await this.props.loginuser(obj);
    let { data } = this.props.user;
    
    if (data.status == true) {
      swal("User is Logged in Successfully","","success");
      localStorage.setItem("email", data.data.email);
      localStorage.setItem("token", data.data.token);

      this.props.history.goBack();
    } else {
      swal(data.message,"","error");
    }
  };
  responseFail = (response) => {
    
  };
  popupComponent() {
    return (
      <Popup trigger={<button>Complete Detail</button>} modal>
        <input
          type="text"
          placeholder="enter the email"
          value={this.state.email}
          onChange={(e) => this.setState({ email: e.target.value })}
        />
        <button onClick={() => this.loginwithfb()}>Login</button>
      </Popup>
    );
  }
  render() {
    return (
      <>
        {/* {this.state.isPopUp ? this.popupComponent():null} */}
        <FacebookLogin
          appId="380901636757259"
          fields="name,email,picture,mobile_no"
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              className="custom-btn google-button"
            >
              <img src="/assets/images/facebook.png" alt="" />
              Continue using Facebook
            </button>
          )}
          callback={this.responseFacebook}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => ({ user: state.login_user });
const mapDispatchToprops = (dispatch) => {
  return {
    loginuser: (data) => dispatch(loginWithFacebook(data)),
    // logoutuser: (data) => dispatch(logoutUser(data))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToprops
)(withRouter(LoginWithFacebook));
