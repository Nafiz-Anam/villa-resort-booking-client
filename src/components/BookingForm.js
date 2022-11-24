import React, { Component } from "react";
import "./popup.css";
import Popup from "reactjs-popup";
import ReactDOM from "react-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

// import 'reactjs-popup/dist/index.css';
import {
    bookVilla,
    resetBook,
    villBookingData,
} from "../redux/action/villa-action";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import villaService from "../services/service";
import PaymentComponent from "./PaymentComponent";
import swal from "sweetalert";
const moment = require("moment");

class BookingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            name: "",
            mobile_no: "",
            booking_info: {},
            open: true,
            coupon: false,
            coupon_code: null,
            iscoupon: true,
            coupon_statement: "",
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        let bookingdata = JSON.parse(this.props.booking_info);

        this.setState({ booking_info: bookingdata });

        if (this.props.user.data) {
            this.setState({
                email: this.props.user.data.data.email,
                name: this.props.user.data.data.name,
                mobile_no: this.props.user.data.data.mobile_no,
            });
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.iscoupon !== this.props.iscoupon) {
            this.setState({
                iscoupon: this.props.iscoupon,
                coupon: this.props.iscoupon,
            });
        }
        if (prevProps.coupone_statement !== this.props.coupone_statement) {
            this.setState({ coupon_statement: this.props.coupone_statement });
        }
    }
    executeScroll = () => window.scrollTo({ behavior: "smooth", top: 0 });

    processBook = (bookingData) => {
        let bdata = JSON.stringify(bookingData);
        this.props.villaBookingData(bdata);

        var headers = {
            Authorization: this.props.user.data.data.token, //the token is a variable which holds the token
        };
        let res = this.props.bookvilla(bdata, headers);

        res.then((result) => {
            if (result.status === true) {
                //   localStorage.removeItem("prevbooking")
                localStorage.removeItem("bdata");
                this.props.villaBookingData({
                    payfull: 0,
                    advance_amount: 0,
                    payadvance: 0,
                });
                this.setState({
                    startDate: null,
                    endDate: null,
                    petsCount: 0,
                    kidsCount: 0,
                    parentsCount: 0,
                    btn: "Check Availability",
                });
                this.props.resetBookingData({});
                swal("villa is booked", "", "success");
                this.props.history.push("/user/myprofile/dashboard");
            } else {
                swal(result.message);
                localStorage.removeItem("token");
                this.props.history.push("/user/login/dashboard");
            }
        });
    };

    bookVilla = () => {
        if (
            this.state.name.trim() === "" ||
            this.state.email.trim() === "" ||
            this.state.mobile_no.trim() === ""
        ) {
            swal("All Fields are mandetory", "", "error");
        } else if (
            !/^[0-9\b]+$/.test(this.state.mobile_no) ||
            this.state.mobile_no.length !== 10
        ) {
            this.setState({ msg: "Enter  valid mobile number" });
            swal("Enter the Valid Mobile Number", "", "error");
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)
        ) {
            this.setState({ msg: "Enter the valid email" });
            swal("Enter The Valid Email", "", "error");
        } else {
            var existing = localStorage.getItem("bdata");
            let booking_info = JSON.parse(this.props.booking_info);
            // If no existing data, create an array
            // Otherwise, convert the localStorage string to an array
            existing = existing ? JSON.parse(existing) : {};

            // Add new data to localStorage Array
            booking_info["guest_name"] = this.state.name;
            booking_info["guest_mobile_no"] = this.state.mobile_no;
            booking_info["guest_email"] = this.state.email;

            // Save back to localStorage
            // localStorage.setItem("bdata", JSON.stringify(existing));
            this.props.villaBookingData(JSON.stringify(booking_info));

            let bdata = JSON.stringify(booking_info);

            // let bdata = this.state.bdata
            return bdata;
        }
    };
    btnComponent = () => {
        return (
            <div className="booking-button">
                <input
                    className="search-box-submit-btn sticky-button"
                    value="Pay And Continue"
                    onClick={() => this.setState({ open: true })}
                    readOnly={true}
                />
            </div>
        );
    };
    couponButton = () => {
        return (
            <div
                className="btn btn-warning btn-large mt-3"
                style={{ width: "298px", height: "48px" }}
                value="Have Promocode ?"
                onClick={() => this.setState({ coupon: true })}
            >
                Have Promocode ?
            </div>
        );
    };

    render() {
        let islogin = this.props.user.data
            ? !this.props.user.data.status
                ? null
                : true
            : null;

        let bookingdata = JSON.parse(this.props.booking_info);

        let guestsInputContent = [
            this.props.singlGuest("Adults", "kidsCount"),
            this.props.singlGuest("Child", "petsCount"),
            this.props.singlGuest("Infant", "parentsCount"),
        ]
            .filter((type) => type)
            .join(", ");

        return (
            <>
                {/* {this.state.iscoupon ? this.couponButton() : this.btnComponent()} */}
                {this.btnComponent()}
                <Modal
                    open={this.state.coupon}
                    onClose={() => this.setState({ coupon: false })}
                    center
                >
                    <input
                        type="text"
                        placeholder="Enter Promocode"
                        value={this.state.coupon_code}
                        onChange={(e) =>
                            this.setState({ coupon_code: e.target.value })
                        }
                    />
                    <button
                        className="btn btn-warning btn-large mt-3"
                        onClick={() => this.props.validateCoupon}
                    >
                        {" "}
                        Apply
                    </button>
                </Modal>

                <Modal
                    open={this.state.open}
                    onClose={() => {
                        this.setState({ open: false });
                        this.props.change_display_pop();
                    }}
                    center
                >
                    {/* <h2>Simple centered modal</h2> */}

                    <div
                        className="popup container"
                        ref={this.myRef}
                        onLoad={() => this.executeScroll()}
                    >
                        <div className="row block-div">
                            <div className="col book ml-8 detail-row">
                                <h3>Booking details</h3>

                                <p>Villa:{this.props.villa.villa_name}</p>

                                <p>
                                    Booking Date:{" "}
                                    {moment(
                                        this.state.booking_info.check_in_date
                                    ).format("DD-MM-YYYY")}{" "}
                                    To{" "}
                                    {moment(
                                        this.state.booking_info.check_out_date
                                    ).format("DD-MM-YYYY")}
                                </p>

                                <p>
                                    {" "}
                                    {this.props.booking_data.booking_status ==
                                    "Partially paid"
                                        ? `Pay Advance : ₹ ${this.props.booking_data.payadvance}`
                                        : `Pay Full : ₹ ${this.props.booking_data.payfull}`}
                                </p>
                                <p>Guest :{guestsInputContent}</p>
                            </div>
                            <div className="col detail-row">
                                <h3>Guest details</h3>

                                <form className="popup-form">
                                    <input
                                        type="text"
                                        name="bane"
                                        placeholder="Name"
                                        value={this.state.name}
                                        onChange={(e) =>
                                            this.setState({
                                                name: e.target.value,
                                            })
                                        }
                                    />

                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Email Id"
                                        value={this.state.email}
                                        onChange={(e) =>
                                            this.setState({
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                    <input
                                        type="text"
                                        name="mobile_no"
                                        placeholder="10 digit mobile number"
                                        value={this.state.mobile_no}
                                        onChange={(e) =>
                                            this.setState({
                                                mobile_no: e.target.value,
                                            })
                                        }
                                    />
                                </form>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div className="center-block">
                        {/* <button
              className="btn btn-warning btn-large mt-3"
              style={{ width: "250px", height: "48px" }}
              onClick={() => {
                this.bookVilla();
              }}
              value="Continue"
            >
              Continue
            </button> */}

                        <PaymentComponent
                            data={this.bookVilla}
                            processBook={this.processBook}
                        />
                    </div>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login_user,
        searchdata: state.searchdata,
        villadetail: state.villa.villadetail,
        booking_data: state.bookData,
    };
};

const mapDispatchToprops = (dispatch) => ({
    bookvilla: (data, headers) => dispatch(bookVilla(data, headers)),
    villaBookingData: (data) => dispatch(villBookingData(data)),
    resetBookingData: (data) => dispatch(resetBook(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToprops
)(withRouter(BookingForm));
