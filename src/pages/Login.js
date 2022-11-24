import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import { loginUser, logoutUser } from "../redux/action/login-action";
import villaService from "../services/service";

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            send_otp: false,
            msg: "",
            email_address: "",
            otp: "",
            isOtpTimeOn: true,
        };
    }

    validateForm = () => {
        const email_address = this.state.email_address;
        if (email_address.trim() === "") {
            this.setState({ msg: "Email address is required" });
            swal("Email address is required", "", "error");
            return false;
        } else {
            return true;
        }
    };

    sendOtp = async (e) => {
        e.preventDefault();

        if (this.validateForm()) {
            let data = {
                email_address: this.state.email_address,
            };

            let res = await villaService.sendLoginOtp(data);

            if (res.data.status === true) {
                this.setState({
                    send_otp: true,
                    msg: "OTP is sent to your email address",
                });
                setTimeout(() => {
                    this.setState({ isOtpTimeOn: false });
                }, 50000);
            } else {
                this.setState({
                    email_address: "",
                    msg: res.data.message,
                    send_otp: false,
                });
                this.props.logoutuser({});
                swal(res.data.message);
            }
        }
    };
    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            // send_otp:false
        });
    };

    handleLogin = async (e) => {
        e.preventDefault();

        let res = await this.props.loginuser(this.state);
        let { data } = this.props.user;
        console.log(" user data =>", data);

        if (data.status === true) {
            swal("User is Logged in Successfully", "", "success");
            localStorage.setItem("email", data.data.email);
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("userData", JSON.stringify(data));
            this.props.history.goBack();
        } else {
            swal(data.message, "", "error");
        }
    };

    render() {
        return (
            <div>
                {/*  Login Section Start */}
                <section
                    className="login-section section-padding"
                    style={{
                        backgroundImage: "url('/assets/images/login-bg.jpg')",
                    }}
                >
                    <div className="login-wrap">
                        <div className="login-head text-center">
                            <h3>Login To Leestays</h3>
                        </div>
                        <div className="login-body">
                            <p>
                                We will send you a One Time Password on your
                                Email address
                            </p>
                            {/* <p>
                                We will send you a One Time Password on your
                                mobile number
                            </p> */}
                            <form>
                                <span>Enter your Email Address</span>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        id="otp"
                                        placeholder="Enter your email address"
                                        name="email_address"
                                        value={this.state.email_address}
                                        onChange={this.handleOnChange}
                                    />
                                </div>

                                {!this.state.send_otp ? (
                                    <div>
                                        <button
                                            className="custom-btn"
                                            onClick={this.sendOtp}
                                        >
                                            Get OTP
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                id="demo"
                                                placeholder="Enter OTP"
                                                name="otp"
                                                value={this.state.otp}
                                                onChange={this.handleOnChange}
                                            />
                                        </div>
                                        <button
                                            className="custom-btn"
                                            onClick={this.handleLogin}
                                        >
                                            Login
                                        </button>
                                        <br />
                                        {!this.state.isOtpTimeOn ? (
                                            <p
                                                style={{ cursor: "pointer" }}
                                                onClick={this.sendOtp}
                                            >
                                                Resend OTP
                                            </p>
                                        ) : null}
                                    </>
                                )}
                                <div>{this.state.msg}</div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapDispatchToprops = (dispatch) => {
    return {
        loginuser: (data) => dispatch(loginUser(data)),
        logoutuser: (data) => dispatch(logoutUser(data)),
    };
};
// export default connect(null,{loginUser})(Login)
export default connect(mapStateToProps, mapDispatchToprops)(withRouter(Login));

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";

// const Login = () => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();
//     const onSubmit = (data) => console.log("form data", data);
//     console.log(errors);

//     const [otp, setotp] = useState(false);

//     const handleSend = () => {
//         setotp(true);
//     };

//     return (
//         <>
//             <section
//                 className="login-section section-padding"
//                 style={{
//                     backgroundImage: "url('/assets/images/login-bg.jpg')",
//                 }}
//             >
//                 <div className="login-wrap">
//                     <div className="login-head text-center">
//                         <h3>Login To Leestays</h3>
//                     </div>
//                     <div className="login-body">
//                         <p>
//                             We will send you a One Time Password on your Email
//                             Address
//                         </p>
//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             <input
//                                 type="email"
//                                 className="px-3"
//                                 placeholder="Email address"
//                                 {...register("email", {})}
//                             />

//                             {otp ? (
//                                 <input
//                                     type="text"
//                                     className="px-3 mt-3"
//                                     placeholder="OTP"
//                                     {...register("otp", {})}
//                                 />
//                             ) : (
//                                 ""
//                             )}

//                             <input
//                                 className="btn btn-warning mt-3 w-50 py-2"
//                                 type="submit"
//                                 onClick={handleSend}
//                             />
//                         </form>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// };

// export default Login;
