import React from "react";

// import 'react-dates/initialize';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker, isSameDay } from "react-dates";
import {
    bookVilla,
    searchData,
    validateVilla,
    detailVilla,
    villBookingData,
    setBookedDates,
    resetBook,
} from "../redux/action/villa-action";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import BookingForm from "./BookingForm";
import villaService from "../services/service";
import { Modal } from "react-responsive-modal";
import { SERVER_URL } from "../config";
import { loginUser, logoutUser } from "../redux/action/login-action";
import axios from "axios";
import "../App.css";
import swal from "sweetalert";

class BookingWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            searchTerm: "",
            kidsCount: this.props.searchdata.kidsCount,
            petsCount: this.props.searchdata.petsCount,
            parentsCount: this.props.searchdata.parentsCount,
            startDate: null,
            endDate: null,
            focusedInput: null,
            guestsInputBorderFocused: false,
            redirectToSearchIdx: false,
            btn: "Check Availability",
            bdata: {},
            payfull: 0,
            payadvance: 0,
            display_pop: true,
            booking_status: "Partially paid",
            full_checked: false,
            advance_checked: true,
            is_avaliable: false,
            villaId: this.props.villa.id,
            guestsInputContent: "",
            btnstate: true,
            isAvaliable: false,
            coupon: false,
            iscoupon: true,
            coupon_statement: "",
            coupon_code: "",
            dateArray: [],
            guestInputString: "",
            showCloseButton: false,
            weekday: 0,
            weekend: 0,
            isCouponApplied: false,
        };

        this.inputNode = React.createRef();
        this.dropdownNode = React.createRef();
        this.calenderNode = React.createRef();
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.increaseCount = this.increaseCount.bind(this);
        this.decreaseCount = this.decreaseCount.bind(this);
        //  this.handleSearchUpdate = this.handleSearchUpdate.bind(this);
        //this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.makeSingleGuestsInputString =
            this.makeSingleGuestsInputString.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentUnmount() {
        var data = localStorage.getItem("bdata");

        if (data) {
            localStorage.removeItem("bdata");
        }
    }
    componentDidUpdate(prevProps, prevState) {
        let bdata = this.props.bookingdata;

        if (prevProps.villa.weekday_price !== this.props.villa.weekday_price) {
            this.handleOnDateChange(bdata.check_in_date, bdata.check_out_date);
        }
    }
    componentDidMount() {
        let bdata = this.props.bookingdata;

        if (bdata.check_in_date && bdata.check_out_date) {
            this.setState(() => {
                this.handleOnDateChange(
                    bdata.check_in_date,
                    bdata.check_out_date
                );
                return {
                    startDate: moment(bdata.check_in_date),
                    endDate: moment(bdata.check_out_date),
                    kidsCount: bdata.adult_person ? bdata.adult_person : 0,
                    petsCount: bdata.children ? bdata.children : 0,
                    parentsCount: bdata.infants ? bdata.infants : 0,
                };
            });
        }
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClick, false);
        //    this.props.clearTreehouseState();
    }

    handleClick(e) {
        if (this.dropdownNode.current.contains(e.target)) {
            this.openDropdown();
            return;
        } else if (this.inputNode.current.contains(e.target)) {
            this.toggleDropdown();
        } else {
            this.closeDropdown();
        }
    }
    clearDateInputs() {
        this.setState({
            startDate: null,
            endDate: null,
            showCloseButton: false,
            payfull: 0,
            payadvance: 0,
        });
    }
    handleSearchUpdate() {
        return (e) => {
            this.setState({
                searchTerm: e.currentTarget.value,
            });
        };
    }

    bookVilla = async () => {
        if (this.state.startDate == null || this.state.endDate == null) {
            swal("Please Select Start Date And End Date", "", "error");
        } else if (this.state.kidsCount + this.state.petsCount <= 0) {
            swal("Please select at least one guest", "", "error");
        } else {
            let momentStartDate = moment(this.state.startDate).format(
                "YYYY-MM-DD"
            );
            let momentEndDate = moment(this.state.endDate).format("YYYY-MM-DD");
            let guest = this.state.kidsCount + this.state.petsCount;
            let data = {
                startdate: momentStartDate,
                enddate: momentEndDate,
                villa: this.props.villa.id,
                guest: guest,
            };

            // await this.handleOnDateChange(momentStartDate, momentEndDate);

            let bdata = {
                check_in_date: momentStartDate,
                check_out_date: momentEndDate,
                villa: this.props.villa.id,
                adult_person: this.state.kidsCount,
                children: this.state.petsCount,
                infants: this.state.parentsCount,
                order_date: new Date(),
                order_time:
                    new Date().getHours() + ":" + new Date().getMinutes(),
                advance_amount: this.state.full_checked
                    ? this.state.payfull
                    : this.state.payadvance,
                btn: this.state.btn,
                payfull: this.state.payfull,
                payadvance: this.state.payadvance,
                total_guest:
                    this.state.kidsCount +
                    this.state.petsCount +
                    this.state.parentsCount,
                booking_status: this.state.booking_status,
                guestsInputContent: this.state.guestsInputContent,
                coupon_code: this.state.isCouponApplied
                    ? this.state.coupon_code
                    : "",
            };

            this.setState({
                bdata: bdata,
            });
            localStorage.setItem("bdata", JSON.stringify(bdata));
            this.props.villaBookingData(bdata);

            validateVilla(data).then((response) => {
                if (response.status == true) {
                    this.setState({
                        display_pop: true,
                        is_avaliable: true,
                        isAvaliable: true,
                    });
                    this.setState({ btn: "Reserve" });

                    if (
                        this.props.user.data == null ||
                        this.props.user.data.status == false
                    ) {
                        this.props.history.push("/user/login/dashboard");
                    }
                    // this.onReserve("Reserve")
                } else {
                    swal(response.message, "", "error");
                }
            });
        }
    };

    toggleDropdown() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    openDropdown() {
        this.setState({ dropdownOpen: true });
    }

    closeDropdown() {
        this.setState({ dropdownOpen: false });
    }

    toggleGuestsInputBorderColor() {
        this.setState({
            guestsInputBorderFocused: !this.state.guestsInputBorderFocused,
        });
    }

    increaseCount(type) {
        // e.stopPropagation();
        if (this.state.startDate === null || this.state.end === null) {
            swal("Please Select Check-In Date and Check-Out Date", "", "error");
        } else {
            this.setState({
                display_pop: false,
                is_avaliable: false,
                isAvaliable: false,
                iscoupon: true,
                isCouponApplied: false,
            });

            let newVal = this.state[type] + 1;
            let total_guest = this.state.kidsCount + this.state.petsCount + 1;

            if (
                total_guest <= this.props.villa.guest ||
                type == "parentsCount"
            ) {
                this.setState({ [type]: newVal }, () => {
                    this.calculateBookingPrice();

                    //   if((this.state.kidsCount + this.state.petsCount  )>this.props.villa.standard_capacity && type != "parentsCount"){

                    //     this.calculateBookingPrice()
                    //   }
                });
            } else {
                swal(
                    "there are only " +
                        this.props.villa.guest +
                        " guest avaliable",
                    "",
                    "error"
                );
            }

            //
        }
    }

    decreaseCount(type) {
        // e.stopPropagation();
        this.setState({
            display_pop: false,
            is_avaliable: false,
            isAvaliable: false,
            iscoupon: true,
            isCouponApplied: false,
        });

        let newVal = this.state[type] - 1;
        if (this.state[type] > 0) {
            this.setState({ [type]: newVal }, () => {
                if (
                    this.state[type] > 0 &&
                    (type === "kidsCount" || type === "petsCount")
                ) {
                    this.calculateBookingPrice();
                }
            });
        }
    }

    makeSingleGuestsInputString(type, stateName) {
        let num = this.state[stateName];
        if (num === 0) return null;
        if (num === 1) {
            return `${num} ${type}`;
        } else {
            return `${num} ${type}`;
        }
    }
    gusetInput = () => {
        let guestsInputContent = [
            this.makeSingleGuestsInputString("Adults", "kidsCount"),
            this.makeSingleGuestsInputString("Child", "petsCount"),
            this.makeSingleGuestsInputString("Infant", "parentsCount"),
        ]
            .filter((type) => type)
            .join(", ");

        return guestsInputContent;
    };
    validateCoupon = async (coupon_code) => {
        if (coupon_code.trim() === "") {
            swal("Please enter the coupon code", "", "error");
        } else {
            let data = await villaService.validateCouponCode({
                coupon_code: coupon_code,
                date: new Date(),
                userid: this.props.user.data.data._id,
            });
            let response = data.data;
            if (response.status) {
                this.setState({
                    display_pop: false,
                    is_avaliable: false,
                    isAvaliable: false,
                    isCouponApplied: true,
                });

                swal(response.message);
                let payfull = this.state.payfull;
                if (response.data.discount_type === "Percent Discount") {
                    let percentAmount =
                        (this.state.payfull * response.data.coupon_amount) /
                        100;
                    let differenceAmount = Math.round(payfull - percentAmount);

                    let partialPricePercent = Math.round(
                        (differenceAmount *
                            parseFloat(
                                this.props.villadetail.data.partial_payment
                            )) /
                            100
                    );
                    this.setState({
                        payfull: differenceAmount,
                        payadvance: partialPricePercent,
                    });
                    this.setState({
                        iscoupon: false,
                        coupon: false,
                        coupon_statement: `Promocode applied successfully! You have saved Rs. ${Math.round(
                            percentAmount
                        )}  on Rs. ${Math.round(payfull)}`,
                    });
                } else if (response.data.coupon_amount > payfull) {
                    swal(
                        "You Cannot Apply for the coupon beacause coupon amount is greater than booking price",
                        "",
                        "error"
                    );
                } else {
                    let percentAmount = Math.round(
                        payfull - response.data.coupon_amount
                    );

                    let partial_price_percent = Math.round(
                        (percentAmount *
                            parseFloat(
                                this.props.villadetail.data.partial_payment
                            )) /
                            100
                    );

                    this.setState({
                        iscoupon: false,
                        coupon: false,
                        coupon_statement: `You have applied coupon and you save Rs. ${response.data.coupon_amount}  on Rs. ${payfull}`,
                        payfull: percentAmount,
                        payadvance: partial_price_percent,
                    });
                }
            } else {
                swal(response.message);
            }
        }
    };
    handleOnDateChange = async (date1, date2) => {
        var start = moment(date1),
            end = moment(date2).clone(),
            day = 0;
        var result = [];
        var otherday = [];
        var current = start.clone().subtract(1, "days");

        var nextDate = start.clone().add(1, "days");

        let checkDatePresent = this.state.dateArray.filter((d) => {
            return moment(d).format("L") !== moment(nextDate).format("L");
        });
        this.setState({ dateArray: checkDatePresent });

        this.setState({
            btn: "Check Avalability",
            iscoupon: true,
            coupon_statement: "",
            isCouponApplied: false,
        });
        this.setState({
            bdata: { check_in_date: date1, check_out_date: date2 },
        });
        this.state.dateArray.map((d) => {
            if (moment(d).format("L") === start.format("L")) {
                this.setState({ startDate: null, endDate: null });
                this.getDates();
            }
        });

        while (current.add(1, "day").isBefore(end)) {
            if (current.day() == 6) {
                result.push(current.clone());
            } else {
                otherday.push(current.clone());
            }
        }

        var vData = await this.props.villa;
        var day = {
            weekday: otherday.length,
            weekend: result.length,
            vData: vData,
        };
        this.setState({ weekday: otherday.length, weekend: result.length });

        this.calculateBookingPrice();
    };

    calculateBookingPrice = () => {
        var villaDetail = this.props.villa;
        let weekday = this.state.weekday; // weekday count
        let weekend = this.state.weekend; // weekend day count
        let weekdayPrice = villaDetail.weekday_price;
        let weekendPrice = villaDetail.weekend_price;
        let max_guest = villaDetail.guest;
        let totalBookingPrice = weekday * weekdayPrice + weekend * weekendPrice;
        let partialPrice = 0;
        let totalGuest = this.state.kidsCount + this.state.petsCount;

        if (totalGuest > villaDetail.standard_capacity) {
            let extraPerson = totalGuest - villaDetail.standard_capacity;
            let weekDayExtraPrice =
                extraPerson *
                Number(villaDetail.weekday_price_extra_adult) *
                weekday;
            let weekEndDayExtraPrice =
                extraPerson *
                Number(villaDetail.weekend_price_extra_adult) *
                weekend;
            totalBookingPrice =
                totalBookingPrice + weekDayExtraPrice + weekEndDayExtraPrice;
            partialPrice = partialPrice + weekEndDayExtraPrice;
        }
        partialPrice =
            (totalBookingPrice * parseFloat(villaDetail.partial_payment)) / 100;
        this.setState({
            payfull: Math.round(totalBookingPrice),
            payadvance: Math.round(partialPrice),
        });
    };

    changeDisplayPopup = () => {
        this.setState({ is_avaliable: false });
    };
    getPayment = (type) => {
        this.setState({
            display_pop: false,
            is_avaliable: false,
            isAvaliable: false,
        });

        type == "Partially paid"
            ? this.setState({ advance_checked: true, full_checked: false })
            : this.setState({ advance_checked: false, full_checked: true });
        this.setState({ booking_status: type });
        // var existing = localStorage.getItem("bdata");

        // // If no existing data, create an array
        // // Otherwise, convert the localStorage string to an array
        // existing = existing ? JSON.parse(existing) : {};

        // // Add new data to localStorage Array
        // existing["booking_status"] = type;

        // // Save back to localStorage
        // localStorage.setItem("bdata", JSON.stringify(existing));
        // this.props.villaBookingData(existing)
    };
    renderValidDate = (f) => {
        if (moment(f).isBefore(moment().subtract(1, "day"))) return true;
        else return false;
    };
    getBlockedDate = (date) => {
        let nowdate = moment(date).format("YYYY-MM-DD");
        nowdate = moment(nowdate).clone();
        let bookindates = this.props.villadetail.data.bookings;
        for (let i = 0; i < bookindates.length; i++) {
            if (
                nowdate.isSameOrAfter(moment(bookindates[i].check_in_date)) &&
                nowdate.isSameOrBefore(moment(bookindates[i].check_in_date))
            ) {
                return true;
            }
        }
        return false;
    };

    getDates() {
        let mark = this.props.villadetail.data.bookings;
        var dateArray = [];
        for (var i in mark) {
            if (
                ["Paid", "Partially paid", "On-hold"].includes(
                    mark[i].booking_status
                ) &&
                mark[i].is_active == true
            ) {
                var currentDate = moment(mark[i].check_in_date);
                var stopDate = moment(mark[i].check_out_date);
                while (currentDate < stopDate) {
                    dateArray.push(moment(currentDate));

                    currentDate = moment(currentDate).add(1, "days");
                }
            }
        }

        //  this.setState({dateArray:dateArray})
        return dateArray;
    }
    isDayBlockedFunc = (day1) => {
        // return this.state.dateArray.some(day2 => isSameDay(day1, day2))
        let dateArray = this.getDates();

        if (
            this.state.startDate &&
            moment(this.state.startDate).add(1, "day").isSame(day1, "day")
        ) {
            return false;
        }

        return dateArray.some((day2) => moment(day2).isSame(day1, "day"));
    };
    btnComponent = () => {
        let userstatus = this.props.user.data
            ? !this.props.user.data.status
                ? null
                : true
            : null;

        let bdata = localStorage.getItem("bdata");
        let popupBtn = this.state.display_pop && (
            <BookingForm
                user={this.props.user}
                villa={this.props.villa}
                booking_info={JSON.stringify(this.state.bdata)}
                singlGuest={this.makeSingleGuestsInputString}
                validateCoupon={(coupon_code) =>
                    this.validateCoupon(coupon_code)
                }
                coupone_statement={this.state.coupon_statement}
                iscoupon={this.state.iscoupon}
                change_display_pop={this.changeDisplayPopup}
            />
        );

        let normalBtn = (
            <div className="booking-button">
                <input
                    className="search-box-submit-btn2"
                    value="Book Now"
                    readOnly={true}
                    onClick={() => this.bookVilla()}
                />
            </div>
        );

        if (
            !userstatus ||
            this.props.user.data == null ||
            !this.state.is_avaliable
        ) {
            return normalBtn;
        } else {
            return popupBtn;
        }
    };

    render() {
        // Conditional to toggle color of minus sign on Guests dropdown
        let islogin = this.props.user.data
            ? !this.props.user.data.status
                ? null
                : true
            : null;

        let kidsMinusSignColorClass =
            this.state.kidsCount === 0
                ? "search-box-minus-circle"
                : "search-box-plus-circle";
        let petsMinusSignColorClass =
            this.state.petsCount === 0
                ? "search-box-minus-circle"
                : "search-box-plus-circle";
        let parentsMinusSignColorClass =
            this.state.parentsCount === 0
                ? "search-box-minus-circle"
                : "search-box-plus-circle";

        // Create Guests input string
        let guestsInputContent = [
            this.makeSingleGuestsInputString("Adults", "kidsCount"),
            this.makeSingleGuestsInputString("Child", "petsCount"),
            this.makeSingleGuestsInputString("Infant", "parentsCount"),
        ]
            .filter((type) => type)
            .join(", ");

        // Conditional for the Guests input chevron
        let chevronDirection;
        if (this.state.dropdownOpen) {
            chevronDirection = "fa fa-chevron-up";
        } else {
            chevronDirection = "fa fa-chevron-down";
        }

        // Conditional for guests input container border color class
        let guestsInputBorderColorClass = this.state.guestsInputBorderFocused
            ? "guests-input-outline-blue"
            : "";

        const dateRangePicker = (
            <DateRangePicker
                startDate={this.state.startDate}
                startDateId="dd/mm/yyyy"
                endDate={this.state.endDate}
                endDateId="mm/dd/yyyy"
                onDatesChange={({ startDate, endDate }) => {
                    this.setState({
                        startDate,
                        endDate,
                        btn: "Check Avaliability",
                        is_avaliable: false,
                    });
                    this.handleOnDateChange(
                        moment(startDate).format("YYYY-MM-DD"),
                        moment(endDate).format("YYYY-MM-DD")
                    );
                }}
                focusedInput={this.state.focusedInput}
                onFocusChange={(focusedInput) =>
                    this.setState({ focusedInput })
                }
                numberOfMonths={1}
                displayFormat={() => "DD/MM/YYYY"}
                // renderCalendarDay={() => this.state.availableDates.map(d => moment(d).format(d))}
                isOutsideRange={(f) => {
                    return this.renderValidDate(f);
                }}
                // isDayBlocked={(f)=>{
                //
                //   return this.getBlockedDate(f)
                // }}
                isDayBlocked={(day1) => this.isDayBlockedFunc(day1)}
                readOnly={true}
            />
        );

        const dropdownMenu = (
            <div
                className="search-box-dropdown-container"
                style={{ zIndex: "999" }}
            >
                <ul>
                    <li>
                        <div className="search-box-dropdown-label">
                            <div className="guest-component-name">Adults</div>
                        </div>
                        <div className="search-box-counter-container">
                            <div
                                className={`${kidsMinusSignColorClass}`}
                                onClick={() => this.decreaseCount("kidsCount")}
                            >
                                –
                            </div>
                            <div className="search-box-dropdown-counter-num">
                                {this.state.kidsCount}+
                            </div>
                            <div
                                className="search-box-plus-circle"
                                onClick={() => {
                                    this.increaseCount("kidsCount");
                                }}
                            >
                                +
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="search-box-dropdown-label">
                            <div className="guest-component-name">Children</div>
                            <div>Ages 2-12</div>
                        </div>
                        <div className="search-box-counter-container">
                            <div
                                className={`${petsMinusSignColorClass}`}
                                onClick={() => this.decreaseCount("petsCount")}
                            >
                                –
                            </div>
                            <div className="search-box-dropdown-counter-num">
                                {this.state.petsCount}+
                            </div>
                            <div
                                className="search-box-plus-circle"
                                onClick={() => this.increaseCount("petsCount")}
                            >
                                +
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="search-box-dropdown-label">
                            <div className="guest-component-name">Infants</div>
                            <div>Under 2</div>
                        </div>
                        <div className="search-box-counter-container">
                            <div
                                className={`${parentsMinusSignColorClass}`}
                                onClick={() =>
                                    this.decreaseCount("parentsCount")
                                }
                            >
                                –
                            </div>
                            <div className="search-box-dropdown-counter-num">
                                {this.state.parentsCount}+
                            </div>
                            <div
                                className="search-box-plus-circle"
                                onClick={() =>
                                    this.increaseCount("parentsCount")
                                }
                            >
                                +
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        );

        let dropdownComponent = this.state.dropdownOpen ? dropdownMenu : <></>;

        return (
            <>
                <div className="splash-image-container">
                    <div class="search-box-container widget booking-widget">
                        <div class="bw-rating">
                            <i class="fa fa-star"></i>{" "}
                            {this.props.villa.villa_rating}
                            <span>
                                ({this.props.villa.total_rating} reviews)
                            </span>
                        </div>

                        <div style={{ clear: "both" }}></div>
                        <div className="bw-head">
                            <h2
                                className="bw-title"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    widthL: "100%",
                                }}
                            >
                                <div>
                                    ₹{this.props.villa.weekday_price}{" "}
                                    <span style={{ fontWeight: "100" }}>
                                        / Sun to Fri
                                    </span>
                                </div>
                                <div>
                                    ₹{this.props.villa.weekend_price}{" "}
                                    <span style={{ fontWeight: "100" }}>
                                        / Saturday
                                    </span>
                                </div>
                            </h2>
                        </div>

                        <form>
                            <div className="form-group">
                                <div className="check_-labels-container">
                                    <span className="search-box-label checkin-label">
                                        CHECK IN
                                        {/* {this.state.showCloseButton ? <span ref={this.calenderNode} style={{cursor:'pointer'}} onClick={()=>this.clearDateInputs()}> X </span> :null}
                                         */}
                                    </span>
                                    <span className="search-box-label checkout-label">
                                        CHECK OUT
                                    </span>
                                </div>
                                <div
                                    className="check_-inputs-container date-ranges"
                                    ref={this.calenderNode}
                                    onClick={() =>
                                        this.setState({ showCloseButton: true })
                                    }
                                >
                                    {dateRangePicker}
                                </div>
                            </div>
                            <div className="guests-box">
                                <span className="search-box-label">GUESTS</span>
                                <div
                                    id={guestsInputBorderColorClass}
                                    className={`search-box-input guests-input-container`}
                                    ref={this.inputNode}
                                    onFocus={() =>
                                        this.toggleGuestsInputBorderColor()
                                    }
                                    onBlur={() =>
                                        this.toggleGuestsInputBorderColor()
                                    }
                                    tabIndex="0"
                                >
                                    <input
                                        className="guests-input booking-wid grey-bg"
                                        type="text"
                                        placeholder="Guests"
                                        readOnly
                                        value={guestsInputContent}
                                        onFocus={() =>
                                            this.toggleGuestsInputBorderColor()
                                        }
                                        onBlur={() =>
                                            this.toggleGuestsInputBorderColor()
                                        }
                                    />
                                    <i
                                        className={`${chevronDirection} chevronDown`}
                                    ></i>
                                </div>
                            </div>
                            <div ref={this.dropdownNode}>
                                {dropdownComponent}
                            </div>
                            <div
                                id="accordion"
                                className="cancle-policy"
                                style={{
                                    display: this.state.dropdownOpen
                                        ? "none"
                                        : "block",
                                    zIndex: "999",
                                }}
                            >
                                <div className="radio-item">
                                    <label style={{ fontWeight: "100" }}>
                                        Pay Advance ₹{this.state.payadvance}{" "}
                                    </label>
                                    <div className="radio-btn-wrapper">
                                        <input
                                            type="radio"
                                            name="payadvance"
                                            id="advance"
                                            checked={this.state.advance_checked}
                                            onChange={() =>
                                                this.getPayment(
                                                    "Partially paid"
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="radio-item">
                                    <label style={{ fontWeight: "100" }}>
                                        Pay Full Amount ₹{this.state.payfull}
                                    </label>
                                    <div className="radio-btn-wrapper">
                                        <input
                                            type="radio"
                                            name="payadvance"
                                            id="full"
                                            checked={this.state.full_checked}
                                            onChange={() =>
                                                this.getPayment("Paid")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="booking-button">
                <button
                  type="button"
                  className="search-box-submit-btn2"
                  onClick={() => this.bookVilla()}
                >
                  Book Now
                </button>
              </div> */}
                            <div>{this.btnComponent()}</div>
                            <p style={{ textAlign: "center" }}>
                                Need help? call 8181909069
                            </p>
                            {this.state.iscoupon && islogin ? (
                                <div
                                    onClick={() =>
                                        this.setState({ coupon: true })
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    <u>Have a promocode ?</u>
                                </div>
                            ) : null}
                            {this.state.isCouponApplied &&
                            !this.state.iscoupon ? (
                                <div>{this.state.coupon_statement}</div>
                            ) : null}
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
                                        this.setState({
                                            coupon_code: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    className="btn btn-warning btn-large mt-3"
                                    onClick={() =>
                                        this.validateCoupon(
                                            this.state.coupon_code
                                        )
                                    }
                                >
                                    {" "}
                                    Apply
                                </button>
                            </Modal>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.login_user,
        searchdata: state.searchdata,
        villadetail: state.villa.villadetail,
        bookingdata: state.bookData,
        bookedDate: state.bookedDate,
    };
};
const mapDispatchToprops = (dispatch) => ({
    bookvilla: (data, headers) => dispatch(bookVilla(data, headers)),
    search: (data) => dispatch(searchData(data)),
    detailvilla: (data) => dispatch(detailVilla(data)),
    villaBookingData: (data) => dispatch(villBookingData(data)),
    setbookedDate: (data) => dispatch(setBookedDates(data)),
    resetBook: () => dispatch(resetBook({})),
    logoutuser: (data) => dispatch(logoutUser(data)),
});
export default connect(
    mapStateToProps,
    mapDispatchToprops
)(withRouter(BookingWidget));
