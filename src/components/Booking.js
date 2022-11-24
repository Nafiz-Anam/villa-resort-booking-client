import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect, useDispatch } from "react-redux";
import {
    searchData,
    searchVilla,
    getDestinationVilla,
    villBookingData,
} from "../redux/action/villa-action";
// import DatePicker from "../components/datePicker";
import { useHistory } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import swal from "sweetalert";
import GuestComponet from "./GuestComponet";
import "./booking.css";

const moment = require("moment");

function Booking(props) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dest, setDest] = useState(props.alldest);
    const wrapperRef = useRef(null);
    const [search, setSearch] = useState("");
    const [display, setDisplay] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const [destination, setDestination] = useState([]);
    const [guest, setGuest] = useState();
    const [hover, setHover] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const thisref = React.createRef();

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: "selection",
        },
    ]);

    const [focusedInput, setFocusedInput] = useState(null);

    // modified
    // const dateRangePicker = (
    //     <DateRangePicker
    //         // startDate={new Date()}
    //         startDateId="dd/mm/yyyy"
    //         // endDate={this.state.endDate}
    //         endDateId="mm/dd/yyyy"
    //         onDatesChange={({ startDate, endDate }) => {
    //             setStartDate(startDate);
    //             setEndDate(endDate);
    //             // this.handleOnDateChange(
    //             //     moment(startDate).format("YYYY-MM-DD"),
    //             //     moment(endDate).format("YYYY-MM-DD")
    //             // );
    //         }}
    //         focusedInput={focusedInput}
    //         onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
    //         numberOfMonths={1}
    //         displayFormat={() => "DD/MM/YYYY"}
    //         // isOutsideRange={(f) => {
    //         //     return this.renderValidDate(f);
    //         // }}
    //         // isDayBlocked={(day1) => this.isDayBlockedFunc(day1)}
    //         readOnly={true}
    //     />
    // );

    const handleOnSearch = async (e) => {
        e.preventDefault();
        if (destination.length == 0) {
            swal("Please Select destination", "", "error");
        } else if (guest !== undefined && isNaN(guest) == true) {
            swal("Guest should be number", "", "error");
        } else {
            // dispatch(searchVilla({ destination: destination[0], guest: props.searchdata.guest,startdate: startDate,enddate: endDate }));
            props.destVilla({
                destination: destination[0],
                guest: props.searchdata.guest,
                startdate: startDate,
                enddate: endDate,
            });
            props.villaBookingData({
                check_in_date: startDate,
                check_out_date: endDate,
            });
            console.log(startDate, "startdate");
            console.log(endDate, "endDate");
            dispatch(
                searchData({
                    destination: destination[0],
                    guest: props.searchdata.guest,
                    startdate: startDate,
                    enddate: endDate,
                })
            );
            const dest = encodeURIComponent(destination[0]).replaceAll(
                "%20",
                "-"
            );

            history.push({
                pathname: `/villas/${dest}`,
                state: { destination: destination[0], guest: guest },
            });
        }
    };

    const setTypeOption = () => {
        const dest = [];
        props.alldest.map((d) => {
            dest.push(d.destination);
        });
        setDest(dest);
    };

    useEffect(async () => {
        await props.search({
            guestString: "",
            kidsCount: 0,
            petsCount: 0,
            parentsCount: 0,
            adult: 0,
            children: 0,
            inftants: 0,
            guest: 0,
        });
        await setDest(props.alldest);
        await setTypeOption();
        document.addEventListener("mousedown", handleClickOutSide);
        return () => {
            document.removeEventListener("mousedown", handleClickOutSide);
        };
    }, []);

    const handleClickOutSide = (event) => {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setDisplay(false);
        }
    };
    const validatedate = (date, dateType) => {
        let date1 = moment(date).format("YYYY-DD-MM");
        let date2 = moment(moment()).format("YYYY-DD-MM");

        // if (new Date(date1)<new Date(date2)) {
        //   setStartDate(null);

        //   alert("Selected Date Should be Greater than Todays date");
        // }
        if (startDate && dateType == "end" && date < startDate) {
            setEndDate(null);
            alert("End Date should be greater than start date");
        }
        if (endDate && dateType == "start" && date > endDate) {
            setStartDate(null);
            alert("Start Date should be smaller than end date");
        }
    };
    const onHover = () => {
        setHover(true);
        return hover ? { zIndex: "999" } : {};
    };
    const formStyle = () => {
        let inputStyle = {
            zIndex: "999",
        };
        let withoutHover = {
            outline: "0",
            borderWidth: "0 0 2px",
            borderColor: "blue",
        };
        return hover ? inputStyle : withoutHover;
    };

    return (
        <div ref={wrapperRef}>
            <div className="search-form">
                <form className="form-inline row no-gutters">
                    <div
                        className="form-group right-border"
                        onMouseEnter={() => onHover()}
                        style={formStyle()}
                        onMouseLeave={() => setHover(false)}
                        onClick={() => setHover(true)}
                    >
                        <label
                            htmlFor="location"
                            style={{ fontWeight: "bold" }}
                        >
                            Destinations
                        </label>

                        <Typeahead
                            placeholder="Select"
                            className="typeahead-view"
                            onChange={(selected) => {
                                if (undefined !== selected[0]) {
                                    //onChange code here
                                    setDestination(null);
                                }
                                // Handle selections...
                                setDestination(selected);
                                setHover(true);
                            }}
                            options={props.alldest.map((d) => {
                                return d.destination;
                            })}
                            value={destination}
                            id="location"
                        />
                        {/* <input className="form-control" type="text" id="location" value={destination} onChange={(e) => {setDestination(e.target.value); setSearch(e.target.value)}} 
                onClick={() => setDisplay(true)}
                placeholder="everywhere" /> */}
                    </div>
                    <div
                        className="form-group date-group right-border select-date flexDisplay"
                        onClick={() => setHover(false)}
                    >
                        {/* <DatePicker /> */}
                        <div className="form-inner">
                            <label
                                htmlFor="location"
                                style={{
                                    fontWeight: "bold",
                                    marginLeft: "0px",
                                }}
                            >
                                Check-in
                            </label>
                            <DatePicker
                                placeholderText="Add Date"
                                portalId="root-portal"
                                selected={startDate}
                                onChange={(date) => {
                                    setEndDate(null);
                                    setStartDate(date);
                                    // validatedate(date, "start");
                                    setOpenCalendar(true);
                                }}
                                dateFormat="dd/MM/yyyy"
                                minDate={moment().toDate()}
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
                        <div className="form-inner" style={{ zIndex: "999" }}>
                            <label
                                htmlFor="location"
                                style={{ fontWeight: "bold" }}
                            >
                                Check-out
                            </label>
                            <DatePicker
                                placeholderText="Add Date"
                                //  popperClassName="date-picker-reports"
                                portalId="root-portal1"
                                popperPlacement="bottom-end"
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
                        className="form-group"
                        style={{ position: "relative", marginTop: "6px" }}
                    >
                        <label
                            htmlFor="location"
                            style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                            Guests
                        </label>
                        <GuestComponet ref={thisref} />
                        {/* <input
              type="text"
              className="form-control"
              placeholder="No. Of Guests"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
            /> */}
                    </div>
                    <div className="form-group search-btn">
                        <button className="custom-btn" onClick={handleOnSearch}>
                            <i className="fa fa-search" /> Search
                        </button>
                    </div>
                </form>
            </div>
            <div>
                {/* {display && props.alldest.filter(({destination})=> destination.indexOf(search.toLowerCase())>-1).map((d) => {
                return (
                    <div 
                    onClick={()=>{setDestination(d.destination);setSearch(d.destination)}}
                    tabIndex="0"
                    style={{cursor:'pointer'}}
                    >{d.destination}</div>
                )
            })} */}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    searchdata: state.searchdata,
    alldest: state.villa.alldest,
});
const mapDispatchToprops = (dispatch) => {
    return {
        search: (data) => dispatch(searchData(data)),
        destVilla: (data) => dispatch(getDestinationVilla(data)),
        villaBookingData: (data) => dispatch(villBookingData(data)),
    };
};
// export default connect(null,{loginUser})(Login)
export default connect(mapStateToProps, mapDispatchToprops)(Booking);
