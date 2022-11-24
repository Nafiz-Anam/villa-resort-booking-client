import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DateCalender from "../components/Calender";
import PopupVideo from "../components/PopupVideo";
import SimiliarVilla from "../components/SimiliarVilla";
import GoogleMapReact from "google-map-react";

import { URL, SERVER_URL } from "../config";
import Calendar from "react-calendar";
import BookingWidget from "../components/BookingWidget";
import ImageSlider from "../components/ImageSlider";
import {
    EmailShareButton,
    FacebookShareButton,
    EmailIcon,
    FacebookIcon,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";
import {
    bookVilla,
    detailVilla,
    getVillaRating,
    getVillaReview,
    similarVilla,
} from "../redux/action/villa-action";
import ReactDatePicker from "react-datepicker";
import ReviewForm from "./ReviewForm";
import MyFancyComponent from "../components/SingleMap";
import villaService from "../services/service";
import Rating from "../components/Rating";
import "../App.css";
import Lightbox from "react-image-lightbox";

import swal from "sweetalert";
import { Helmet } from "react-helmet";
const moment = require("moment");

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const imagess = [
    "//placekitten.com/1500/500",
    "//placekitten.com/4000/3000",
    "//placekitten.com/800/1200",
    "//placekitten.com/1500/1500",
];

export class SingleVilla extends Component {
    constructor(props) {
        super(props);
        this.initalState = {
            id: this.props.match.params.id,
            vdetail: "",
            check_out_date: new Date().toISOString().substr(0, 10),
            check_in_date: new Date().toISOString().substr(0, 10),
            adult_person: 0,
            children: 0,
            infants: 0,
            villa: this.props.match.params.id,
            villa_name: "",
            order_date: new Date(),
            guest_check_in_time: "",
            guest_check_out_time: "",
            special_note_guest: "",
            payment_mode: "",
            payment_id: "",
            booking_status: "Paid",
            total_guest: 0,
            guest_address: "",
            advance_amount: 0,
            bookprice: 0,
            calender: true,
            review: false,
            headers: "",
        };
        this.state = {
            id: this.props.match.params.vname,
            vdetail: "",
            check_out_date: new Date().toISOString().substr(0, 10),
            check_in_date: new Date().toISOString().substr(0, 10),
            adult_person: 0,
            children: 0,
            infants: 0,
            villa: this.props.match.params.vname,
            villa_name: "",
            order_date: new Date(),
            guest_check_in_time: "",
            guest_check_out_time: "",
            special_note_guest: "",
            payment_mode: "",
            payment_id: "",
            booking_status: "Paid",
            total_guest: 0,
            guest_address: "",
            advance_amount: 0,
            bookprice: 0,
            calender: true,
            review: false,
            isbookmark: false,
            headers: false,
            rdata: [],
            total_rating: 0,
            count: 0,
            seeMore: 6,
            descriptionLength: { count: 800, status: false },
            stick: false,
            photoIndex: 0,
            isOpen: false,
        };
        this.myRef = React.createRef();
    }

    static defaultProps = {
        center: {
            lat: 19.12151266185159,
            lng: 74.77880144001962,
        },
        zoom: 11,
    };

    componentWillMount() {}

    setParentstate = (state) => {
        this.setState({ isOpen: state });
    };
    executeScroll = () =>
        window.scrollTo({
            behavior: "smooth",
            top: this.myRef.current.offsetTop,
        });

    listenScrollEvent = (e) => {
        const side = document.getElementById("sidebar");
        if (window.scrollY > 500) {
            this.setState({ stick: true });
        } else if (window.scrollY < 500) {
            this.setState({ stick: false });
        } else if (window.scroll >= 2248) {
            this.setState({ stick: false });
        }
    };

    async componentDidMount() {
        await this.loadVillaDetail();
        this.props.getreview({ villaId: this.props.villadetail.data._id });

        this.checkBookMark();
        this.getRating();
        window.addEventListener("scroll", this.listenScrollEvent);
    }
    loadVillaDetail = async () => {
        await this.props.detailvilla({
            id: this.state.id,
            villa_name: this.props.match.params.vname.replaceAll("-", " "),
            destination: this.props.match.params.single.replaceAll("-", " "),
        });
        this.setState({ id: this.props.villadetail.data._id });
    };
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.vname !== this.props.match.params.vname) {
            this.setState({
                id: this.props.match.params.id,
                villa_name: this.props.match.params.villa_name,
            });
        }
    }
    getRating = async () => {
        let rating = await getVillaRating({ villa: this.state.id });

        let ratedata = rating.data.rating;
        this.setState({
            rdata: ratedata,
            total_rating: rating.data.totalRating,
            count: rating.data.count,
        });
    };
    checkBookMark = () => {
        if (this.props.user.data != null) {
            let headers = {
                Authorization: this.props.user.data.data.token, //the token is a variable which holds the token
            };
            this.setState({ headers: headers });
            let bookmark = villaService.checkBookmark(
                { villa: this.state.id },
                headers
            );
            bookmark.then((res) => {
                if (res.data.status) {
                    this.setState({ isbookmark: true });
                }
            });
        }
    };

    addBookmark = () => {
        if (!this.state.headers) {
            swal("Please login", "", "error");
        } else {
            let headers = {
                Authorization: this.props.user.data.data.token, //the token is a variable which holds the token
            };
            let bookmark = villaService.addBookmark(
                { villa: this.state.id },
                headers
            );
            bookmark.then((res) => {
                if (res.status) {
                    this.setState({ isbookmark: true });
                }
            });
        }
    };
    removeBookmark = () => {
        if (!this.state.headers) {
        } else {
            let headers = {
                Authorization: this.props.user.data.data.token, //the token is a variable which holds the token
            };
            let bookmark = villaService.removeBookmark(
                { villa: this.state.id },
                headers
            );
            bookmark.then((res) => {
                if (res.data.status) {
                    this.setState({ isbookmark: false });
                }
            });
        }
    };
    changeCalandar = () => {
        this.setState(!this.state.calender);
    };
    handleOnDateChange = (date1, date2) => {
        var start = moment(date1), // Sept. 1st
            end = moment(date2).clone().add(1, "days"), // Nov. 2nd
            day = 0; // Sunday

        var result = [];
        var otherday = [];
        var current = start.clone().subtract(1, "days");

        while (current.add(1, "day").isBefore(end)) {
            if (current.day() == 0 || current.day() == 6) {
                result.push(current.clone());
            } else {
                otherday.push(current.clone());
            }
        }
        var vData = this.props.villadetail;

        var day = { weekday: otherday.length, weekend: result.length };
        var weekday_price = vData.data.weekday_price;
        var weekend_price = vData.data.weekend_price;
        var booking_price =
            day.weekday * weekday_price + day.weekend * weekend_price;
        this.setState({ bookprice: booking_price });
        //
    };
    handleOnChange = async (e) => {
        await this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => {
                this.setState({
                    total_guest:
                        Number(this.state.children) +
                        Number(this.state.infants) +
                        Number(this.state.adult_person),
                });
                if (
                    e.target.name == "check_in_date" ||
                    e.target.name == "check_out_date"
                ) {
                    this.handleOnDateChange(
                        this.state.check_in_date,
                        this.state.check_out_date
                    );
                }
            }
        );

        // this.setState({guest:Number(this.state.children)+Number(this.state.infants)+Number(this.state.adult_person)})
    };
    handleOnSubmit = (e) => {
        e.preventDefault();
    };

    componentDidUpdate(prevState, updateState) {}

    getBookingInfo(data) {
        let startd = data.startDate._d;
        let startdate = startd.toISOString().slice(0, 10);
        let endd = data.endDate._d;
        let enddate = endd.toISOString().slice(0, 10);
    }
    checkRating = (el) => {
        let f = this.state.rdata.find((r) => {
            if (r.rating_type == el) {
                return r.avg;
            }
        });
        if (f == undefined) {
            return 0;
        } else return f.avg;
    };

    tConvert(time) {
        // Check correct time format and split into components
        time = time
            .toString()
            .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(""); // return adjusted time or original string
    }

    render() {
        let amenities = [];
        let vData = this.props.villadetail;
        if (vData.data == null || vData.data.length == 0) {
            return <div>Loading..</div>;
        }
        const { photoIndex, isOpen } = this.state;
        const images = this.props.images;

        return (
            <div>
                <Helmet>
                    <meta
                        name="description"
                        content={vData.data && vData.data.villa_name}
                    />
                </Helmet>
                {/* Main Section Start */}

                <main className="main-content package-content pt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <article className="single-package">
                                    <div className="pckg-head">
                                        <div className="pckg-intro">
                                            <div className="pckg-name">
                                                <h1
                                                    style={{
                                                        textTransform:
                                                            "capitalize",
                                                    }}
                                                >
                                                    {vData.data &&
                                                        vData.data.villa_name}
                                                </h1>
                                                <p>
                                                    {vData.data &&
                                                        vData.data.destination
                                                            .destination}
                                                    ,
                                                    {vData.data.geoaddress &&
                                                        vData.data.geoaddress
                                                            .formattedAddress}{" "}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="rev-book">
                                            <span>
                                                <img
                                                    src={`${URL}/assets/images/star.png`}
                                                    alt=""
                                                    className="borderLess"
                                                />
                                                {this.state.total_rating} (
                                                {this.state.count} reviews){" "}
                                            </span>
                                            <div className="pckg-share">
                                                <span className="mr-1">
                                                    Bookmark{" "}
                                                    {this.state.isbookmark ? (
                                                        <img
                                                            src={`${URL}/assets/images/bookmarks.svg`}
                                                            alt=""
                                                            onClick={() =>
                                                                this.removeBookmark()
                                                            }
                                                        />
                                                    ) : (
                                                        <img
                                                            src={`${URL}/assets/images/bookedmark.svg`}
                                                            alt=""
                                                            onClick={() =>
                                                                this.addBookmark()
                                                            }
                                                        />
                                                    )}
                                                </span>

                                                <span
                                                    className="mr-1"
                                                    style={{
                                                        outline: "none",
                                                        border: 0,
                                                        color: "white",
                                                    }}
                                                >
                                                    <WhatsappShareButton
                                                        url={`${URL}/${vData.data.destination.destination}/${this.state.villa}`}
                                                    >
                                                        <WhatsappIcon
                                                            round={true}
                                                            size={25}
                                                        ></WhatsappIcon>
                                                    </WhatsappShareButton>
                                                </span>
                                                <span className="mr-1">
                                                    <FacebookShareButton
                                                        url={`${URL}/${vData.data.destination.destination}/${this.state.villa}`}
                                                    >
                                                        <FacebookIcon
                                                            round={true}
                                                            size={25}
                                                        ></FacebookIcon>
                                                    </FacebookShareButton>
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mb-2"></p>
                                        <div className="pckg-img-wrap">
                                            <div className="pckg-thubm">
                                                <img
                                                    src={
                                                        vData.data &&
                                                        `${SERVER_URL}/${vData.data.villa_photos[0]}`
                                                    }
                                                    onClick={() =>
                                                        this.setState({
                                                            isOpen: true,
                                                        })
                                                    }
                                                    alt=""
                                                    className="main-img"
                                                />
                                            </div>
                                            <div className="pckg-sthumb">
                                                <div
                                                    className="borders"
                                                    onClick={() =>
                                                        this.setState({
                                                            isOpen: true,
                                                        })
                                                    }
                                                >
                                                    {vData.data &&
                                                        vData.data.villa_photos
                                                            .slice(1, 5)
                                                            .map((p, index) => {
                                                                var bord =
                                                                    index === 1
                                                                        ? "border1"
                                                                        : index ===
                                                                          3
                                                                        ? "border3"
                                                                        : "single1";
                                                                return (
                                                                    <img
                                                                        className={
                                                                            bord
                                                                        }
                                                                        src={`${SERVER_URL}/${p}`}
                                                                        alt=""
                                                                        key={p}
                                                                    />
                                                                );
                                                            })}
                                                    <div className="see-more-img-btn">
                                                        All Images
                                                    </div>
                                                    <ImageSlider
                                                        isOpen={
                                                            this.state.isOpen
                                                        }
                                                        setParentstate={
                                                            this.setParentstate
                                                        }
                                                        images={
                                                            vData.data &&
                                                            vData.data
                                                                .villa_photos
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>{" "}
                                    {/* Package Head End */}
                                    <div className="package-inner row">
                                        <div className="col-lg-8">
                                            <div className="pckg-txt">
                                                <div className="pk-options">
                                                    <ul>
                                                        <li>
                                                            <img
                                                                src={`${URL}/assets/images/persons.svg`}
                                                                alt=""
                                                            />{" "}
                                                            <span>
                                                                {vData.data &&
                                                                    vData.data
                                                                        .standard_capacity}{" "}
                                                                -{" "}
                                                                {vData.data &&
                                                                    vData.data
                                                                        .max_capacity}{" "}
                                                                guests
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <img
                                                                src={`${URL}/assets/images/beds.svg`}
                                                                alt=""
                                                            />{" "}
                                                            <span>
                                                                {vData.data &&
                                                                    vData.data
                                                                        .no_of_beds}{" "}
                                                                beds
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <img
                                                                src={`${URL}/assets/images/bathrooms.svg`}
                                                                alt=""
                                                            />{" "}
                                                            <span>
                                                                {vData.data &&
                                                                    vData.data
                                                                        .no_of_bathrooms}{" "}
                                                                bathrooms
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <img
                                                                src={`${URL}/assets/images/mattresses.svg`}
                                                                alt=""
                                                            />{" "}
                                                            <span>
                                                                {vData.data &&
                                                                    vData.data
                                                                        .no_of_mattresses}{" "}
                                                                Mattresses
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <h2>
                                                    {vData.data &&
                                                        vData.data
                                                            .villa_info_text}{" "}
                                                </h2>
                                                <p
                                                    style={{
                                                        overflowWrap:
                                                            "break-word",
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            vData.data &&
                                                            vData.data.description.slice(
                                                                0,
                                                                this.state
                                                                    .descriptionLength
                                                                    .count
                                                            ),
                                                    }}
                                                    id="desc"
                                                ></p>
                                                {vData.data.description
                                                    .length >= 800 ? (
                                                    <button
                                                        className="more-btn"
                                                        style={{
                                                            cursor: "pointer",
                                                            border: "none",
                                                            background: "none",
                                                            outline: "none",
                                                        }}
                                                        onClick={() => {
                                                            this.setState({
                                                                descriptionLength:
                                                                    {
                                                                        count: !this
                                                                            .state
                                                                            .descriptionLength
                                                                            .status
                                                                            ? vData
                                                                                  .data
                                                                                  .description
                                                                                  .length
                                                                            : 800,
                                                                        status: !this
                                                                            .state
                                                                            .descriptionLength
                                                                            .status,
                                                                    },
                                                            });
                                                        }}
                                                    >
                                                        {this.state
                                                            .descriptionLength
                                                            .status ? (
                                                            <a href="#desc">
                                                                Read Less
                                                            </a>
                                                        ) : (
                                                            "Read More"
                                                        )}
                                                    </button>
                                                ) : null}
                                                <div className="amenities">
                                                    <h3>Amenities</h3>
                                                    <ul className="row">
                                                        {vData.data &&
                                                            vData.data.amenities
                                                                // .slice(
                                                                //     0,
                                                                //     Number(
                                                                //         this
                                                                //             .state
                                                                //             .seeMore
                                                                //     )
                                                                // )
                                                                .map((a) => (
                                                                    <li
                                                                        className="col-3 middle"
                                                                        key={
                                                                            a.amenity_image
                                                                        }
                                                                    >
                                                                        <img
                                                                            src={`${SERVER_URL}/${a.amenity_image}`}
                                                                            // src={`/assets/images/${a.amenity}.svg`}
                                                                            alt=""
                                                                            style={{
                                                                                marginBottom:
                                                                                    "10px",
                                                                            }}
                                                                        />{" "}
                                                                        <span>
                                                                            {
                                                                                a.amenity
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                    </ul>

                                                    {/* {vData.data &&
                                                    vData.data.amenities
                                                        .length >
                                                        Number(
                                                            this.state.seeMore
                                                        ) ? (
                                                        <button
                                                            className="more-btn"
                                                            style={{
                                                                cursor: "pointer",
                                                                border: "none",
                                                                background:
                                                                    "none",
                                                                outline: "none",
                                                            }}
                                                            onClick={() =>
                                                                this.setState({
                                                                    seeMore:
                                                                        vData
                                                                            .data
                                                                            .amenities
                                                                            .length,
                                                                })
                                                            }
                                                        >
                                                            See More
                                                        </button>
                                                    ) : (
                                                        <></>
                                                    )} */}
                                                    <div id="my-calendar" />
                                                </div>
                                                <div className="timing">
                                                    <h3>Timings</h3>
                                                    <ul>
                                                        <li>
                                                            Check-in
                                                            <span>
                                                                {vData.data &&
                                                                    this.tConvert(
                                                                        vData
                                                                            .data
                                                                            .check_in_time
                                                                    )}
                                                            </span>
                                                        </li>
                                                        <li>
                                                            Checkout
                                                            <span>
                                                                {vData.data &&
                                                                    this.tConvert(
                                                                        vData
                                                                            .data
                                                                            .check_out_time
                                                                    )}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="availity">
                                                    <h3>Availability</h3>
                                                    <div className="availy-callendar">
                                                        <div className="acl-item">
                                                            <DateCalender
                                                                dates={
                                                                    vData.data
                                                                        .bookings
                                                                }
                                                                date={
                                                                    new Date()
                                                                }
                                                            />
                                                        </div>
                                                        <div className="acl-item">
                                                            <DateCalender
                                                                dates={
                                                                    vData.data
                                                                        .bookings
                                                                }
                                                                date={
                                                                    new Date(
                                                                        new Date().getFullYear(),
                                                                        new Date().getMonth() +
                                                                            1,
                                                                        1
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Availity End */}
                                                {/* <div className="villa-video about-img">
                          <img src="assets/images/villa-v.jpg" alt="" />
                          <PopupVideo />
                        </div>
                        Villa End */}
                                            </div>
                                            <div className="boxed-img">
                                                <div className="about-img">
                                                    {vData.data
                                                        .youtube_video_banner ? (
                                                        <img
                                                            src={`${SERVER_URL}/${vData.data.youtube_video_banner}`}
                                                            alt="Youtube video"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={`${URL}/assets/images/about_1.jpg`}
                                                            alt="Youtube video"
                                                        />
                                                    )}

                                                    <PopupVideo
                                                        videoURl={
                                                            vData.data &&
                                                            vData.data
                                                                .youtube_video_link
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-lg-4 fixed-content"
                                            ref={this.myRef}
                                        >
                                            <aside
                                                className={
                                                    this.state.stick
                                                        ? "sidebar fixed"
                                                        : "sidebar"
                                                }
                                            >
                                                <BookingWidget
                                                    book={this.getBookingInfo}
                                                    villa={{
                                                        id: this.state.id,
                                                        guest: vData.data
                                                            .max_capacity,
                                                        standard_capacity:
                                                            vData.data
                                                                .standard_capacity,
                                                        weekday_price:
                                                            vData.data
                                                                .weekday_price,
                                                        weekend_price:
                                                            vData.data
                                                                .weekend_price,
                                                        partial_payment:
                                                            vData.data
                                                                .partial_payment,
                                                        villa_rating:
                                                            vData.data
                                                                .villa_rating,
                                                        total_rating:
                                                            vData.data
                                                                .total_rating,
                                                        villa_name:
                                                            vData.data
                                                                .villa_name,
                                                        weekday_price_extra_adult:
                                                            vData.data
                                                                .weekday_price_extra_adult,
                                                        weekend_price_extra_adult:
                                                            vData.data
                                                                .weekend_price_extra_adult,
                                                    }}
                                                />
                                            </aside>
                                        </div>
                                        <div className="col-lg-4"></div>
                                        <div className="booking-button">
                                            <input
                                                className="search-box-submit-btn sticky-button"
                                                value="Book Now"
                                                readOnly={true}
                                                onClick={this.executeScroll}
                                            />
                                        </div>
                                    </div>
                                    <div className="row boxed-img">
                                        {/* <div className="about-img">
                      <img src={`${SERVER_URL}/${vData.data.youtube_video_banner}`} alt="About" />
                      <PopupVideo
                        videoURl={vData.data && vData.data.youtube_video_link}
                      />
                    </div> */}
                                        {/* <div className="row align-items-center">
                      <div className="col-lg-12">
                        
                      </div>
                    </div> */}
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="villa-reviews">
                                                <h3
                                                    style={{
                                                        marginBottom: "22px",
                                                    }}
                                                >
                                                    Reviews
                                                </h3>
                                                <span>
                                                    <i className="fa fa-star" />
                                                    {this.state.total_rating} (
                                                    {this.state.count} reviews)
                                                </span>
                                                <div className="rating-list clearfix">
                                                    <div className="single-rev">
                                                        <div className="s-label">
                                                            Cleanliness
                                                        </div>

                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar w-75"
                                                                role="progressbar"
                                                                aria-valuenow={
                                                                    this.checkRating(
                                                                        "cleanliness"
                                                                    ) * 20
                                                                }
                                                                aria-valuemin={
                                                                    0
                                                                }
                                                                aria-valuemax={
                                                                    100
                                                                }
                                                            />
                                                        </div>

                                                        <div className="s-rating">
                                                            {this.checkRating(
                                                                "cleanliness"
                                                            )}{" "}
                                                        </div>
                                                        <Rating
                                                            villa={
                                                                this.state.id
                                                            }
                                                            rating_type={
                                                                "cleanliness"
                                                            }
                                                            getrating={
                                                                this.getRating
                                                            }
                                                        />
                                                    </div>{" "}
                                                    {/* Single Review End */}
                                                    <div className="single-rev">
                                                        <div className="s-label">
                                                            Staff
                                                        </div>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar w-75"
                                                                role="progressbar"
                                                                aria-valuenow={
                                                                    this.checkRating(
                                                                        "staff"
                                                                    ) * 20
                                                                }
                                                                aria-valuemin={
                                                                    0
                                                                }
                                                                aria-valuemax={
                                                                    100
                                                                }
                                                            />
                                                        </div>
                                                        <div className="s-rating">
                                                            {this.checkRating(
                                                                "staff"
                                                            )}
                                                        </div>
                                                        <Rating
                                                            villa={
                                                                this.state.id
                                                            }
                                                            rating_type={
                                                                "staff"
                                                            }
                                                            getrating={
                                                                this.getRating
                                                            }
                                                        />
                                                    </div>{" "}
                                                    {/* Single Review End */}
                                                    <div className="single-rev">
                                                        <div className="s-label">
                                                            Check-in
                                                        </div>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar w-25"
                                                                role="progressbar"
                                                                aria-valuenow={
                                                                    this.checkRating(
                                                                        "check_in_process"
                                                                    ) * 20
                                                                }
                                                                aria-valuemin={
                                                                    0
                                                                }
                                                                aria-valuemax={
                                                                    100
                                                                }
                                                            />
                                                        </div>
                                                        <div className="s-rating">
                                                            {this.checkRating(
                                                                "check_in_process"
                                                            )}
                                                        </div>

                                                        <Rating
                                                            villa={
                                                                this.state.id
                                                            }
                                                            rating_type={
                                                                "check_in_process"
                                                            }
                                                            getrating={
                                                                this.getRating
                                                            }
                                                        />
                                                    </div>{" "}
                                                    {/* Single Review End */}
                                                    <div className="single-rev">
                                                        <div className="s-label">
                                                            Location
                                                        </div>
                                                        <div className="progress">
                                                            <div
                                                                className="progress-bar w-50"
                                                                role="progressbar"
                                                                aria-valuenow={
                                                                    this.checkRating(
                                                                        "location"
                                                                    ) * 20
                                                                }
                                                                aria-valuemin={
                                                                    0
                                                                }
                                                                aria-valuemax={
                                                                    100
                                                                }
                                                            />
                                                        </div>
                                                        <div className="s-rating">
                                                            {this.checkRating(
                                                                "location"
                                                            )}
                                                        </div>
                                                        <Rating
                                                            villa={
                                                                this.state.id
                                                            }
                                                            rating_type={
                                                                "location"
                                                            }
                                                            getrating={
                                                                this.getRating
                                                            }
                                                        />
                                                    </div>{" "}
                                                    {/* Single Review End */}
                                                </div>
                                            </div>{" "}
                                            {/* Villa Review End */}
                                            <div>
                                                <div className="pckg-review row">
                                                    {this.props.villaReview.map(
                                                        (r) => (
                                                            <div
                                                                className="col-6"
                                                                style={{
                                                                    marginBottom:
                                                                        "50px",
                                                                }}
                                                            >
                                                                <div className="">
                                                                    <div className="rv-name">
                                                                        <div className="review-flex">
                                                                            <div>
                                                                                <img
                                                                                    className="review-image"
                                                                                    src="/assets/images/rev2.png"
                                                                                    alt=""
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <h5>
                                                                                    {
                                                                                        r
                                                                                            .user
                                                                                            .name
                                                                                    }
                                                                                </h5>
                                                                                <span>
                                                                                    {r.date.substring(
                                                                                        0,
                                                                                        10
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <p>
                                                                            {
                                                                                r.review
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                {/* Single Review End */}
                                                <div className="col reviews">
                                                    {/* <div> */}
                                                    <button
                                                        className="btn btn btn-outline-dark col-4 all-rev"
                                                        onClick={() =>
                                                            this.props.getreview(
                                                                {
                                                                    villaId:
                                                                        this
                                                                            .state
                                                                            .id,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        All Reviews {">>"}
                                                    </button>
                                                    <button
                                                        className="btn btn btn-outline-dark col-4 ml-4"
                                                        style={{
                                                            marginLeft: "10px",
                                                        }}
                                                        onClick={() =>
                                                            this.setState({
                                                                review: !this
                                                                    .state
                                                                    .review,
                                                            })
                                                        }
                                                    >
                                                        Add Review
                                                    </button>
                                                    {/* </div> */}
                                                </div>
                                                {this.state.review ? (
                                                    <ReviewForm
                                                        review={() =>
                                                            this.setState({
                                                                review: false,
                                                            })
                                                        }
                                                        data={{
                                                            villaId:
                                                                this.state.id,
                                                        }}
                                                    />
                                                ) : null}
                                            </div>{" "}
                                            {/* Package Review End */}
                                            {/* Location Start */}
                                            <div className="pckg-location">
                                                <h3 className="subtitle">
                                                    Location
                                                </h3>
                                                <p>
                                                    {vData.data.geoaddress &&
                                                        vData.data.geoaddress
                                                            .formattedAddress}
                                                </p>
                                                <div className="villa-map">
                                                    {/* <iframe width="100%" height={400} frameBorder={0} scrolling="no" marginHeight={0} marginWidth={0} src="https://www.google.com/?q=19.32,32.423" /> */}
                                                </div>
                                                <MyFancyComponent
                                                    marker={{
                                                        lat: Number(
                                                            vData.data.latitude
                                                        ),
                                                        lng: Number(
                                                            vData.data.longitude
                                                        ),
                                                        villa_name:
                                                            vData.data
                                                                .villa_name,
                                                    }}
                                                />
                                            </div>
                                            {/* Location End */}
                                            {/* Nearby Place Start */}
                                            <div className="nearby-place row pt-5 pb-5">
                                                <div className="col-lg-3 nearby">
                                                    <h3 className="subtitle">
                                                        Nearby places{" "}
                                                    </h3>
                                                    <ul>
                                                        <li
                                                            style={{
                                                                overflowWrap:
                                                                    "break-word",
                                                            }}
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    vData.data &&
                                                                    vData.data
                                                                        .nearby_place,
                                                            }}
                                                        ></li>
                                                        {/* <li>New Delli<span>3 km</span></li>
                          <li>New Delli<span>3 km</span></li>
                          <li>New Delli<span>3 km</span></li>
                          <li>New Delli<span>3 km</span></li>
                          <li>New Delli<span>3 km</span></li> */}
                                                    </ul>
                                                </div>
                                                <div className="col-lg-9 house-rule">
                                                    <h3 className="subtitle">
                                                        House rules
                                                    </h3>
                                                    <ol>
                                                        <li>
                                                            {"Goverment Id: "}{" "}
                                                            {vData.data &&
                                                                vData.data
                                                                    .house_rules}
                                                            {vData.data &&
                                                            vData.data
                                                                .is_goverment_id
                                                                ? "YES"
                                                                : "NO"}
                                                        </li>

                                                        <li>
                                                            {"Smoking: "}{" "}
                                                            {vData.data &&
                                                            vData.data
                                                                .is_smoking
                                                                ? "YES"
                                                                : "NO"}
                                                        </li>

                                                        <li>
                                                            {"Drinking: "}{" "}
                                                            {vData.data &&
                                                            vData.data
                                                                .is_drinking
                                                                ? "YES"
                                                                : "NO"}
                                                        </li>
                                                        <li>
                                                            {"Infants: "}{" "}
                                                            {vData.data &&
                                                            vData.data
                                                                .is_infants
                                                                ? "YES"
                                                                : "NO"}
                                                        </li>
                                                        <li>
                                                            {"Pets: "}{" "}
                                                            {vData.data &&
                                                            vData.data.is_pets
                                                                ? "YES"
                                                                : "NO"}
                                                        </li>

                                                        {/* <li>Speaker music can only be played till 10 PM in the night. </li>
                          <li>Swimming pool time is from 2 PM to 9 PM and 6 AM to 9 AM. Swimming in to
                            the pool won’t be allowed in other timeslots.</li>
                          <li> Remaining booking amount and security deposit needs to be submitted
                            while check-in. Security deposit will be returned while check-out.</li> */}
                                                    </ol>
                                                </div>
                                            </div>
                                            {/* Nearby Place End */}
                                            {/* Hosted by Start */}
                                            <div className="hosted-by pb-5">
                                                <h3 className="subtitle">
                                                    Hosted by
                                                </h3>
                                                <div className="host-wrap">
                                                    <div className="single-host">
                                                        <img
                                                            src={`${URL}/assets/images/host1.jpg`}
                                                            alt=""
                                                        />
                                                        <div className="sh-name">
                                                            <h5>
                                                                {vData.data &&
                                                                    vData.data
                                                                        .host
                                                                        .name}
                                                            </h5>
                                                            <span>
                                                                Marathi, Hindi
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Hosted by End */}
                                        </div>
                                    </div>
                                </article>
                                {/* Single Package End */}
                                <SimiliarVilla
                                    destination={vData.data.destination}
                                    villa_id={vData.data._id}
                                />
                            </div>
                        </div>
                    </div>
                </main>
                {/* Main Section End */}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    villadetail: state.villa.villadetail,
    villaReview: state.villa.villaReview,
    user: state.login_user,
    villarating: state.villarating,
});
const mapDispatchToprops = (dispatch) => {
    return {
        detailvilla: (data) => dispatch(detailVilla(data)),

        getreview: (data) => dispatch(getVillaReview(data)),
        getrating: (data) => dispatch(getVillaRating(data)),
    };
};
// export default connect(null,{loginUser})(Login)
export default connect(
    mapStateToProps,
    mapDispatchToprops
)(withRouter(SingleVilla));

// export default SingleVilla
