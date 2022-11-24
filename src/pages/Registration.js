import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { registerUser } from "../redux/action/login-action";
import villaService from "../services/service";

export class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            mobile_no: "",
            send_otp: false,
            otp: "",
            msg: "",
        };
    }

    handleOnChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleOnSubmit = async (e) => {
        e.preventDefault();

        if (this.state.otp === undefined) {
            this.setState({ msg: "Please Enter the Otp", send_otp: false });
        } else {
            let resdata = {
                ...this.state,
                mobile_otp: this.state.otp,
            };
            var res = await this.props.registeruser(resdata);
            console.log("res => ", res);
            var res = this.props.user;
            if (res.data.status == true) {
                this.setState({
                    msg: "You have registered successfully",
                    otp: "",
                    mobile_no: "",
                    email: "",
                    name: "",
                });
                localStorage.setItem("email", res.data.data.email);
                localStorage.setItem("token", res.data.data.token);
                this.props.history.push("/");
            } else {
                this.setState({ msg: res.data.message, otp: "" });
            }
        }
    };

    validateForm = () => {
        const { name, email, mobile_no } = this.state;
        if (name == "" || email == "" || mobile_no == " ") {
            this.setState({ msg: "All fields are required" });
            return false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            this.setState({ msg: "Enter the valid email" });
            return false;
        } else if (!/^[0-9\b]+$/.test(mobile_no)) {
            this.setState({ msg: "Enter valid mobile number" });
            return false;
        } else {
            return true;
        }
    };

    sendOtp = async (e) => {
        e.preventDefault();
        if (this.validateForm()) {
            let data = {
                mobile_no: this.state.mobile_no,
                email: this.state.email,
                name: this.state.name,
            };
            let res = await villaService.sendRegisterOtp(data);

            this.setState({ send_otp: res.data.status, msg: res.data.message });
        }
    };

    render() {
        return (
            <div>
                {/*  Registration Section Start */}
                <section
                    className="login-section register-section section-padding"
                    style={{
                        backgroundImage: "url('/assets/images/login-bg.jpg')",
                    }}
                >
                    <div className="login-wrap">
                        <div className="login-head text-center">
                            <h3>Register To Leestays</h3>
                        </div>
                        <div className="login-body">
                            <form>
                                <div
                                    className="form-group"
                                    style={{ color: "black" }}
                                >
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Your Name"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleOnChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Your Email Id"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleOnChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        id="number"
                                        placeholder="Mobile Number"
                                        name="mobile_no"
                                        value={this.state.mobile_no}
                                        onChange={this.handleOnChange}
                                    />
                                </div>
                                {this.state.send_otp ? (
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            id="otp"
                                            placeholder="Enter Otp"
                                            name="otp"
                                            value={this.state.otp}
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                ) : null}

                                {this.state.send_otp ? (
                                    <div>
                                        <button
                                            className="custom-btn"
                                            onClick={this.handleOnSubmit}
                                        >
                                            Register
                                        </button>
                                        <br />
                                        <a
                                            style={{ cursor: "pointer" }}
                                            onClick={this.sendOtp}
                                        >
                                            Resend OTP
                                        </a>
                                    </div>
                                ) : (
                                    <button
                                        className="custom-btn"
                                        onClick={this.sendOtp}
                                    >
                                        Send OTP
                                    </button>
                                )}
                                <div>{this.state.msg}</div>
                            </form>
                        </div>
                    </div>
                </section>
                {/* Registration Section End */}
            </div>
        );
    }
}
const mapStateToProps = (state) => ({ user: state.login_user });
const mapDispatchToprops = (dispatch) => {
    return {
        registeruser: (data) => dispatch(registerUser(data)),
    };
};

