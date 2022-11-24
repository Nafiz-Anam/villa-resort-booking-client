import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import {
    getDestinationVilla,
    searchData,
    villBookingData,
} from "../redux/action/villa-action";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Link, useHistory } from "react-router-dom";
import GuestComponet from "./GuestComponet";
import { useParams } from "react-router-dom";
import "../App.css";
import swal from "sweetalert";

const moment = require("moment");

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function Booking2(props) {
    let searchParams = useParams();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [destinaton, setDestination] = useState([
        searchParams.destination.replaceAll("-", " "),
    ]);
    const [newdest, setNewDest] = useState(searchParams.destination);

    const [guest, setGuest] = useState(props.data.guest);
    const [search, setSearch] = useState("");
    const [display, setDisplay] = useState(false);
    const wrapperRef = useRef(null);
    const [hover, setHover] = useState(false);
    const [ismap, setIsMap] = useState(props.ismap);
    const [isProps, setIsProps] = useState(props.searchdata.isProps);
    const [openCalendar, setOpenCalendar] = useState(false);
    const dest = encodeURIComponent(destinaton[0]).replaceAll("%20", "-");
    // props.search({destination:searchParams.destination})
    // const [count,setCount]=useState(0)

    // const prevCountRef = useRef();
    const history = useHistory();
    const checkIsDate = () => {
        if (props.data.startdate && props.data.enddate) {
            setStartDate(props.data.startdate);
            setEndDate(props.data.enddate);
        }
    };
    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (destinaton.length == 0) {
            swal("Please Select destination", "", "error");
        } else if (guest !== undefined && isNaN(guest) === true) {
            swal("Guest should be number", "", "error");
        } else {
            props.search({
                destination: destinaton[0].replaceAll("-", " "),
                guest: props.searchdata.guest,
                startdate: startDate,
                enddate: endDate,
            });
            props.villaBookingData({
                check_in_date: startDate,
                check_out_date: endDate,
            });

            props.destVilla({
                destination: destinaton[0].replaceAll("-", " "),
                guest: props.searchdata.guest,
                startdate: startDate,
                enddate: endDate,
            });
            // props.handleSearch()
            let destval = encodeURIComponent(dest).replaceAll("%20", "-");

            props.ismap
                ? history.push({ pathname: `/villas/mapview/${destval}` })
                : history.push(`/villas/${destval}`);
        }
    };
    useEffect(() => {
        // prevCountRef.current = count;
        checkIsDate();

        props.search({
            destination: searchParams.destination.replaceAll("-", " "),
        });

        document.addEventListener("mousedown", handleClickOutSide);
        return () => {
            document.removeEventListener("mousedown", handleClickOutSide);
        };
    }, [ismap, newdest]);
    //  const prevCount = prevCountRef.current;
    const prevCount = usePrevious(destinaton);

    const handleClickOutSide = (event) => {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setDisplay(false);
        }
    };
    const validatedate = (date, dateType) => {
        if (
            moment(date).format("YYYY-MM-DD") <
            moment(new Date()).format("YYYY-MM-DD")
        ) {
            setStartDate(null);

            swal(
                "Selected Date Should be Greater than Todays date",
                "",
                "error"
            );
        }

        if (dateType == "start" && endDate !== null && date > endDate) {
            setStartDate(null);
            swal("Start Date should be smaller than end date", "", "error");
        }
        if (dateType == "end" && date < startDate) {
            setEndDate(null);
            swal("End Date should be greater than start date", "", "error");
        }
    };
    const goDestinationPage = () => {
        history.push(`/villas/${dest}`);
    };
    const onHover = () => {
        setHover(true);
        return hover ? { zIndex: "9999" } : {};
    };
    const formStyle = () => {
        let inputStyle = {
            zIndex: "9999",
        };
        let withoutHover = {};
        return hover ? inputStyle : withoutHover;
    };
    const typeAhead = () => {
        return (
            <Typeahead
                placeholder="Select"
                onFocus={() => {
                    setHover(true);
                    setIsProps(false);
                }}
                onChange={(selected) => {
                    // Handle selections...

                    setDestination(selected);
                    setHover(true);
                }}
                options={props.alldest.map((d) => {
                    return d.destination;
                })}
                selected={destinaton}
                id="location"
                onBlur={() => setIsProps(true)}
            />
        );
    };
    return (
        <div ref={wrapperRef}>
            <div className="search-form">
                <form
                    onSubmit={handleOnSubmit}
                    className="form-inline row no-gutters"
                >
                    <div
                        className="form-group right-border2"
                        onMouseEnter={() => onHover()}
                        style={formStyle()}
                        onMouseLeave={() => setHover(false)}
                    >
                        <label htmlFor="location">Destinations</label>

                        {typeAhead()}
                        {/* <input className="form-control" type="text" id="location" placeholder="everywhere"  value={destinaton} onChange={(e) => {setDestination(e.target.value); setSearch(e.target.value)}} 
                onClick={() => setDisplay(true)}/> */}
                    </div>
                    <div
                        className="form-group date-group right-border flexDisplay"
                        onClick={() => setHover(false)}
                    >
                        <div className="form-inner" style={{ zIndex: "9999" }}>
                            <label
                                htmlFor="location"
                                style={{ marginLeft: "8px`" }}
                            >
                                Check-in
                            </label>
                            <DatePicker
                                portalId="root-portal"
                                placeholderText="Add Date"
                                selected={startDate}
                                onChange={(date) => {
                                    setStartDate(date);
                                    setEndDate(null);
                                    // validatedate(date, "start");
                                    setOpenCalendar(true);
                                }}
                                minDate={moment().toDate()}
                                dateFormat="dd/MM/yyyy"
                                onChangeRaw={(e) => {
                                    e.preventDefault();
                                }}
                                onFocus={(e) => {
                                    e.preventDefault();
                                    e.target.blur();
                                }}
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                }}
                            />
                        </div>
                        <div className="chevronRight">{">"}</div>
                        <div className="form-inner">
                            <label htmlFor="location">Check-out</label>
                            <DatePicker
                                portalId="root-portal"
                                popperPlacement="bottom-end"
                                placeholderText="Add Date"
                                selected={endDate}
                                onChange={(date) => {
                                    setEndDate(date);
                                    validatedate(date, "end");
                                    setOpenCalendar(false);
                                }}
                                minDate={moment(startDate).toDate()}
                                dateFormat="dd/MM/yyyy"
                                onChangeRaw={(e) => {
                                    e.preventDefault();
                                }}
                                onFocus={(e) => {
                                    e.preventDefault();
                                    e.target.blur();
                                }}
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                }}
                                open={openCalendar}
                                onClickOutside={() => setOpenCalendar(false)}
                                onInputClick={() => setOpenCalendar(true)}
                            />
                        </div>
                    </div>
                    <div
                        className="form-group "
                        style={{ position: "relative", marginTop: "4px" }}
                    >
                        <label
                            htmlFor="location"
                            style={{ textAlign: "center" }}
                        >
                            Guests
                        </label>
                        <GuestComponet />
                        {/* <input
              type="text"
              className="form-control"
              placeholder="No. Of Guests"
              onChange={(e) => setGuest(e.target.value)}
            /> */}
                    </div>

                    <div className="form-group search-btn">
                        <button className="custom-btn2">
                            {" "}
                            <i className="fa fa-search" /> Search
                        </button>
                    </div>
                    <div className="form-group filter-btn">
                        <Link
                            className="filter-btn"
                            onClick={(e) => handleOnSubmit(e)}
                            style={{ cursor: "pointer", outline: "none" }}
                        >
                            <img
                                src="/assets/images/filter.svg"
                                alt=""
                                className="filter-icon"
                            />{" "}
                            Filter
                        </Link>
                        {ismap ? (
                            <Link
                                className="filter-btn"
                                onClick={() => goDestinationPage()}
                            >
                                <span>
                                    <img
                                        src="/assets/images/Rect.svg"
                                        alt=""
                                        className="card-icon"
                                    />{" "}
                                    Card View
                                </span>
                            </Link>
                        ) : (
                            <Link
                                to={`/villas/mapview/${encodeURIComponent(
                                    props.searchdata.destination
                                ).replaceAll("%20", "-")}`}
                                className="filter-btn"
                                onClick={() => {
                                    setIsMap(false);
                                }}
                            >
                                <img
                                    src="/assets/images/map.svg"
                                    alt=""
                                    className="filter-map"
                                />{" "}
                                Map View
                            </Link>
                        )}
                    </div>
                </form>
                <div>
                    {display &&
                        props.alldest
                            .filter(
                                ({ destination }) =>
                                    destination.indexOf(search.toLowerCase()) >
                                    -1
                            )
                            .map((d) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setDestination(d.destination);
                                            setSearch(d.destination);
                                        }}
                                        tabIndex="0"
                                        style={{ cursor: "pointer" }}
                                    >
                                        {d.destination}
                                    </div>
                                );
                            })}
                    {/* {dest.map((d) => (

                    <div key={d._id}>{d.destination}</div>
                ))} */}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    searchdata: state.searchdata,
    destvilla: state.villa.destVilla,
    alldest: state.villa.alldest,
});
const mapDispatchToprops = (dispatch) => {
    return {
        search: (data) => dispatch(searchData(data)),
        destVilla: (data) => dispatch(getDestinationVilla(data)),
        villaBookingData: (data) => dispatch(villBookingData(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToprops)(Booking2);
