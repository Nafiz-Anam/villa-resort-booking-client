import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { connect, useSelector } from "react-redux";
import { Link, useHistory, useParams, withRouter } from "react-router-dom";
import { URL } from "../config";
import { getDestination, searchData } from "../redux/action/villa-action";
import "../App.css";

const Header = (props) => {
    const [stick, setStick] = useState(true);
    const token = localStorage.getItem("token");
    const [urlDestination, setUrlDestination] = useState();
    const [isToggle, setIsToggle] = useState(false);
    const [offset, setOffset] = useState(0);

    let user1 = props.data;

    const userstatus = props.user.data
        ? !props.user.data.status
            ? null
            : true
        : null;

    const checkIsLogin = props.user.data && props.user.data.status;
    const user = props.data;
    const history = useHistory();
    let destname = history.location.pathname.replaceAll("-", " ");
    let list = destname.split("/");
    let k = list.includes(props.searchdata.destination);
    if (k) {
        destname = props.searchdata.destination;
    }
    const handleOnClick = async (destination) => {
        props.search({
            destination: destination.replaceAll("-", " "),
            guest: null,
            startdate: null,
            enddate: null,
            isProps: true,
        });
        const dest = encodeURIComponent(destination).replaceAll("%20", "-");

        history.push({
            pathname: `/villas/${dest}`,
            state: { destination: destination.replaceAll("-", " ") },
        });
    };
    function checkIsOutSideClick(ref) {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                // alert("You clicked outside of me!");
                // setIsToggle(false)
                props.isToggleSet(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }

    function onScroll() {
        // setOffset(window.pageYOffset);
        props.isToggleSet(false);
    }
    useEffect(() => {
        if (token == null) {
            user1 = false;
        } else {
            user1 = true;
        }
        // clean up code
        // window.removeEventListener('scroll', onScroll);
        // window.addEventListener('scroll', onScroll);
        // return () => window.removeEventListener('scroll', onScroll);
    }, [user1, props.isHeaderToggle]);
    const wrapperRef = useRef(null);
    checkIsOutSideClick(wrapperRef);

    function dropActions(d) {
        handleOnClick(d.destination);
        props.isToggleSet(!props.isHeaderToggle);
    }
    function redirectToLogin() {
        history.push("/user/login/dashboard");
        props.isToggleSet(!props.isHeaderToggle);
    }
    function redirectToProfile() {
        history.push("/user/myprofile/dashboard");
        props.isToggleSet(!props.isHeaderToggle);
    }
    function redirectToLogout() {
        history.push("/user/logout/dashboard");
        props.isToggleSet(!props.isHeaderToggle);
    }
    return (
        <header className={stick ? "header-section" : ""} id="header">
            <div
                ref={wrapperRef}
                className="primary-navigation start-header start-style"
            >
                <div className="container nav-row">
                    <div className="row">
                        <div className="col-12">
                            <nav className="navbar navbar-expand-md">
                                <Link to="/" className="navbar-brand">
                                    <img
                                        src={`${URL}/assets/images/logoname.svg`}
                                        alt="BrandNav"
                                    />
                                </Link>
                                <button
                                    className={
                                        props.isHeaderToggle
                                            ? "navbar-toggler collapsed"
                                            : "navbar-toggler"
                                    }
                                    type="button"
                                    aria-expanded={
                                        props.isHeaderToggle ? "true" : "false"
                                    }
                                >
                                    <span
                                        className="navbar-toggler-icon"
                                        onClick={() => {
                                            props.isToggleSet(
                                                !props.isHeaderToggle
                                            );
                                        }}
                                    />
                                </button>
                                <div
                                    className={
                                        props.isHeaderToggle
                                            ? "navbar-collapse collapse show"
                                            : "collapse navbar-collapse"
                                    }
                                    id="navbarSupportedContent"
                                    // onClick={()=>props.isToggleSet(!props.isHeaderToggle)}
                                >
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-item">
                                            <p
                                                to=""
                                                className="nav-link dropdown-toggle"
                                                data-toggle="dropdown"
                                                role="button"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Destinations
                                            </p>

                                            <div
                                                className="dropdown-menu"
                                                onClick={() =>
                                                    props.isToggleSet(false)
                                                }
                                            >
                                                {props.dest.map((d) => (
                                                    <li
                                                        className="dropdown-item"
                                                        key={d.destination}
                                                        style={{
                                                            cursor: "pointer",
                                                            textTransform:
                                                                "capitalize",
                                                        }}
                                                        onClick={() =>
                                                            dropActions(d)
                                                        }
                                                    >
                                                        {destname ==
                                                        d.destination ? (
                                                            <span
                                                                style={{
                                                                    color: "yellow",
                                                                }}
                                                            >
                                                                {" "}
                                                                {d.destination}
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                {" "}
                                                                {d.destination}
                                                            </span>
                                                        )}
                                                    </li>
                                                ))}
                                            </div>
                                        </li>

                                        <li className="nav-item query-item">
                                            <Link
                                                className="nav-link"
                                                target="_blank"
                                                to="/get-quotation"
                                            >
                                                Get Quotation
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <p
                                                className="nav-link dropdown-toggle"
                                                data-toggle="dropdown"
                                                to=""
                                                role="button"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="fa fa-user" />
                                            </p>
                                            <div
                                                className="dropdown-menu"
                                                onClick={() =>
                                                    props.isToggleSet(false)
                                                }
                                            >
                                                {!checkIsLogin ? (
                                                    <>
                                                        <Link
                                                            to="/user/register/dashboard"
                                                            className="dropdown-item"
                                                        >
                                                            Register
                                                        </Link>
                                                        <div
                                                            className="dropdown-item"
                                                            onClick={
                                                                redirectToLogin
                                                            }
                                                        >
                                                            Login
                                                        </div>
                                                        {/* <Link
                              to="/user/login/dashboard"
                              className="dropdown-item"
                              
                            >
                              Login
                            </Link> */}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div
                                                            className="dropdown-item"
                                                            onClick={
                                                                redirectToProfile
                                                            }
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            My profile
                                                        </div>
                                                        <div
                                                            className="dropdown-item"
                                                            onClick={
                                                                redirectToLogout
                                                            }
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            Log out
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                        <li className="nav-item hideIt">
                                            <div className="contacts-no">
                                                <span>
                                                    <img
                                                        src="/assets/images/phone.png"
                                                        alt="phone"
                                                    />
                                                </span>
                                                <p>
                                                    <a
                                                        href="tel:+918181909069"
                                                        style={{
                                                            color: "white",
                                                        }}
                                                    >
                                                        8181909069
                                                    </a>
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        <div className="contact-no">
                            <span>
                                <img
                                    src="/assets/images/phone.png"
                                    alt="phone"
                                />
                            </span>
                            <p>
                                <a
                                    href="tel:+918181909069"
                                    style={{ color: "white" }}
                                >
                                    8181909069
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const mapStateToProps = (state) => ({
    user: state.login_user,
    dest: state.villa.alldest,
    searchdata: state.searchdata,
});

const mapDispatchToprops = (dispatch) => {
    return {
        search: (data) => dispatch(searchData(data)),
    };
};
// export default connect(null,{loginUser})(Login)
export default connect(mapStateToProps, mapDispatchToprops)(withRouter(Header));
