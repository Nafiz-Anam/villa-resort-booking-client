import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import { logoutUser, updateUser } from "../redux/action/login-action";
import { getBooking } from "../redux/action/villa-action";
import "../App.css";
const moment = require("moment");
export class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            name: "",
            mobile_no: "",
            email: "",
            address: "",
            password: "",
            id: "",
            collapse: false,
            areaExpand: true,
            isBooking: false,
            bookingNumber: 5,
            errmsg: "",
            isvalid: true,
        };
    }
    async componentDidMount() {
        var headers = {
            Authorization: this.state.token, //the token is a variable which holds the token
        };
        await this.props.getBooking(headers);
        var pdata = this.props.bdetail;
        this.componentShouldNavigate(pdata);
        this.setUserState();
    }
    componentShouldNavigate(pdata) {
        if (pdata.payload.status == false) {
            this.props.history.push("/");
            localStorage.removeItem("token");
            this.props.logoutuser({});
        }
    }
    setUserState() {
        if (this.props.user.data != null && this.props.user.data.data) {
            this.setState({
                ...this.props.user.data.data,
                id: this.props.user.data.data._id,
            });
        }
    }
    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
        let mobile_no =
            e.target.name == "mobile_no" && e.target.value.length !== 10;
        if (mobile_no) {
            this.setState({
                errmsg: "Enter the Valid Mobile Number",
                isvalid: false,
            });
        } else if (!mobile_no) {
            this.setState({ errmsg: "", isvalid: true });
        } else {
            if (
                e.target.name == "email" &&
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                    e.target.email
                )
            ) {
                this.setState({
                    errmsg: "Enter the Valid Email",
                    isvalid: false,
                });
            } else {
                this.setState({ errmsg: "", isvalid: true });
            }
        }
    };
    handleButton = (e) => {
        let text = e.target.innerText;
        text == "Show less"
            ? (e.target.innerText = "Show More")
            : (e.target.innerText = "Show less");
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.state.isvalid) {
            let headers = {
                Authorization: this.state.token, //the token is a variable which holds the token
            };
            let data = {
                name: this.state.name,
                mobile_no: this.state.mobile_no,
                address: this.state.address,
                email: this.state.email,
                password: this.state.password,
                id: this.state.id,
            };
            let res = await this.props.updateprofile(data, headers);
            if (res.status && res.status == true) {
                swal(res.message);
            } else {
                swal(res.message, "", "error");
            }
        } else {
            swal(this.state.errmsg, "", "error");
        }
    };
    getNextBooking = () => {
        let bLength =
            this.props.bdetail.payload &&
            this.props.bdetail.payload.data.length;
        if (this.state.bookingNumber <= bLength) {
            this.setState({ bookingNumber: this.state.bookingNumber + 5 });
        }
    };
    getPreviousBooking = () => {
        if (this.state.bookingNumber - 5 >= 0) {
            this.setState({ bookingNumber: this.state.bookingNumber - 5 });
        }
    };
    // changeArea = () => {}
    render() {
        // if (this.props.bdetail.payload && this.props.bdetail.payload.data.length == 0) {
        //     return "No Booking Found"
        // }

        return (
            <>
                {/*  Booking Section Start */}
                <section
                    className="booking-section section-padding space-btwn-bottom"
                    style={{ textAlign: "initial" }}
                >
                    <div className="container ">
                        <div className="row">
                            <div className="col-3">
                                <div
                                    className="nav flex-column"
                                    id="v-pills-tab"
                                    role="tablist"
                                    aria-orientation="vertical"
                                >
                                    <a
                                        className="nav-link active"
                                        id="booking-tab"
                                        data-toggle="tab"
                                        href="#booking"
                                        role="tab"
                                        aria-controls="booking"
                                        aria-selected="true"
                                        onClick={() =>
                                            this.setState({ isBooking: true })
                                        }
                                    >
                                        {" "}
                                        My Bookings
                                    </a>
                                    <a
                                        className="nav-link"
                                        id="profile-tab"
                                        data-toggle="tab"
                                        href="#profile"
                                        role="tab"
                                        aria-controls="profile"
                                        aria-selected="false"
                                        onClick={() =>
                                            this.setState({ isBooking: false })
                                        }
                                    >
                                        My Profile
                                    </a>
                                </div>
                            </div>
                            <div className="underline"></div>
                            <div className="col-9 blocks">
                                <div
                                    className="tab-content"
                                    id="v-pills-tabContent"
                                >
                                    {this.props.bdetail.payload &&
                                    this.state.isBooking &&
                                    this.props.bdetail.payload.data.length ==
                                        0 ? (
                                        "No Booking Found"
                                    ) : (
                                        <div
                                            className="tab-pane fade show active"
                                            id="booking"
                                            role="tabpanel"
                                            aria-labelledby="home-tab"
                                        >
                                            <div id="accordion-1">
                                                {this.props.bdetail.payload &&
                                                    this.props.bdetail.payload.data
                                                        .slice(
                                                            0,
                                                            this.state
                                                                .bookingNumber
                                                        )
                                                        .map((b) => (
                                                            <div
                                                                className="card"
                                                                key={b._id}
                                                            >
                                                                <div
                                                                    className="card-header"
                                                                    id={`heading${b._id}`}
                                                                >
                                                                    <div className="card-txt">
                                                                        <p>
                                                                            Booking
                                                                            ID:{" "}
                                                                            {
                                                                                b.booking_id
                                                                            }{" "}
                                                                            -
                                                                            Order
                                                                            date:{" "}
                                                                            {moment(
                                                                                b.order_date
                                                                            ).format(
                                                                                "DD-MM-YYYY"
                                                                            )}{" "}
                                                                            -
                                                                            Time:{" "}
                                                                            {
                                                                                b.order_time
                                                                            }
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                b
                                                                                    .villa
                                                                                    .villa_name
                                                                            }{" "}
                                                                            &nbsp;
                                                                            Check-in:{" "}
                                                                            {moment(
                                                                                b.check_in_date
                                                                            ).format(
                                                                                "DD-MM-YYYY"
                                                                            )}{" "}
                                                                            &nbsp;
                                                                            Checkout:
                                                                            {moment(
                                                                                b.check_out_date
                                                                            ).format(
                                                                                "DD-MM-YYYY"
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        className="btn btn-link collapsed"
                                                                        data-toggle="collapse"
                                                                        id={`btn-${b._id}`}
                                                                        data-target={`#collapse${b._id}`}
                                                                        aria-expanded="true"
                                                                        aria-controls={`#collapse${b._id}`}
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            this.handleButton(
                                                                                e
                                                                            )
                                                                        }
                                                                    >
                                                                        {/* {this.state.collapse ? "Show Less" : "Show More"} */}{" "}
                                                                        Show
                                                                        More
                                                                    </button>
                                                                </div>
                                                                <div
                                                                    id={`collapse${b._id}`}
                                                                    className="collapse"
                                                                    aria-labelledby={`heading${b._id}`}
                                                                    data-parent="#accordion-1"
                                                                >
                                                                    <div className="card-body">
                                                                        <h6>
                                                                            Booking
                                                                            status:
                                                                            {
                                                                                b.booking_status
                                                                            }{" "}
                                                                        </h6>
                                                                        <ul>
                                                                            <li>
                                                                                Adults:{" "}
                                                                                {
                                                                                    b.adult_person
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                Childrens:{" "}
                                                                                {
                                                                                    b.children
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                Infants:{" "}
                                                                                {
                                                                                    b.infants
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                Final
                                                                                Booking
                                                                                price:
                                                                                ₹
                                                                                {
                                                                                    b.final_booking_price
                                                                                }{" "}
                                                                            </li>
                                                                            <li>
                                                                                Advance
                                                                                amount:
                                                                                ₹
                                                                                {
                                                                                    b.advance_amount
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                Remaining
                                                                                amount:
                                                                                ₹
                                                                                {
                                                                                    b.remaining_amount
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                Payment
                                                                                mode:{" "}
                                                                                {
                                                                                    b.payment_mode
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                Payment
                                                                                ID:{" "}
                                                                                {
                                                                                    b.payment_id
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                Check-in-date:{" "}
                                                                                {moment(
                                                                                    b.check_in_date
                                                                                ).format(
                                                                                    "DD-MM-YYYY"
                                                                                )}
                                                                            </li>
                                                                            <li>
                                                                                {" "}
                                                                                Check-out-date:{" "}
                                                                                {moment(
                                                                                    b.check_out_date
                                                                                ).format(
                                                                                    "DD-MM-YYYY"
                                                                                )}
                                                                            </li>
                                                                            <li>
                                                                                Guest
                                                                                Check-In
                                                                                Time:
                                                                                {
                                                                                    b.guest_check_in_time
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                Guest
                                                                                Check-Out
                                                                                Time:{" "}
                                                                                {
                                                                                    b.guest_check_out_time
                                                                                }
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                        paddingBottom: "10px",
                                                    }}
                                                >
                                                    {this.props.bdetail
                                                        .payload &&
                                                    this.props.bdetail.payload
                                                        .data.length > 5 ? (
                                                        <>
                                                            {this.state
                                                                .bookingNumber -
                                                                5 >
                                                            0 ? (
                                                                <button
                                                                    className="btn btn-secondary text-left"
                                                                    onClick={() =>
                                                                        this.getPreviousBooking()
                                                                    }
                                                                >
                                                                    Previous
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="btn btn-secondary text-left"
                                                                    onClick={() =>
                                                                        this.getPreviousBooking()
                                                                    }
                                                                    disabled
                                                                >
                                                                    Previous
                                                                </button>
                                                            )}

                                                            <button
                                                                className="btn btn-secondary pull-right"
                                                                onClick={() =>
                                                                    this.getNextBooking()
                                                                }
                                                            >
                                                                Next
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                                {/* <div className="card">
                                                <div className="card-header" id="heading2">
                                                    <div className="card-txt">
                                                        <p>Booking ID: 2567 - Order date: 11 Jully 2021 - Time: 11:00 AM
                          </p>
                                                        <p>Hennessy Villa      Check-in: 12 Jully 2021      Checkout: 13 Jully 2021</p>
                                                    </div>
                                                    <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                                        Show More
                        </button>
                                                </div>
                                                <div id="collapse2" className="collapse" aria-labelledby="heading2" data-parent="#accordion-1">
                                                    <div className="card-body">
                                                        <h6>Booking status: Partially Paid </h6>
                                                        <ul>
                                                            <li>Adults: 2</li>
                                                            <li>Childrens: 1</li>
                                                            <li>Infants: 1</li>
                                                            <li>Final Booking price: ₹3000 </li>
                                                            <li>Advance amount: ₹3500</li>
                                                            <li>Remaining amount: ₹3500</li>
                                                            <li>Payment mode: Credit Card</li>
                                                            <li>Payment ID: RZRPY5452HGDEJ</li>
                                                            <li>Guest Check-in Time: 1:00 PM
                            </li>
                                                            <li>Guest Checkout Time: 11:00 AM
                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div> */}
                                            </div>
                                        </div>
                                    )}

                                    {this.props.user.data &&
                                    !this.state.isBooking ? (
                                        <div
                                            className="tab-pane fade"
                                            id="profile"
                                            role="tabpanel"
                                            aria-labelledby="profile-tab"
                                        >
                                            <form onSubmit={this.handleSubmit}>
                                                <div className="form-group user-form">
                                                    <label htmlFor="name">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Thomas Doe"
                                                        name="name"
                                                        value={this.state.name}
                                                        onChange={
                                                            this.handleOnChange
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group user-form">
                                                    <label htmlFor="name">
                                                        Contact Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="0193878237"
                                                        name="mobile_no"
                                                        value={
                                                            this.state.mobile_no
                                                        }
                                                        onChange={
                                                            this.handleOnChange
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group user-form">
                                                    <label htmlFor="name">
                                                        Email Id
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="thomas@gmail.com"
                                                        name="email"
                                                        value={this.state.email}
                                                        onChange={
                                                            this.handleOnChange
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group user-form">
                                                    <label htmlFor="name">
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Macaline New York"
                                                        value={
                                                            this.state.address
                                                        }
                                                        name="address"
                                                        onChange={
                                                            this.handleOnChange
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group user-form">
                                                    <label htmlFor="name">
                                                        Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        placeholder="........"
                                                        value={
                                                            this.state.password
                                                        }
                                                        name="password"
                                                        onChange={
                                                            this.handleOnChange
                                                        }
                                                    />
                                                </div>
                                                <button
                                                    className="custom-btn"
                                                    onClick={() =>
                                                        this.handleSubmit
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Booking Section End */}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    bdetail: state.bookingDetail,
    user: state.login_user,
});
const mapDispatchToprops = (dispatch) => {
    return {
        getBooking: (token) => dispatch(getBooking(token)),
        logoutuser: (data) => dispatch(logoutUser(data)),
        updateprofile: (data, headers) => dispatch(updateUser(data, headers)),
    };
};
// export default connect(null,{loginUser})(Login)

