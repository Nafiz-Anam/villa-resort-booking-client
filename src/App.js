import React, { useEffect, useState } from "react";
import "./App.css";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Mapview from "./pages/MapView";
import Destination from "./pages/Destination";
import SingleVilla from "./pages/SingleVilla1";
import Register from "./pages/Registration";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Logout from "./pages/Logout";
import BlogPage from "./pages/BlogPage";
import SendInquiry from "./pages/SendInquiry";
import ScrollToTop from "./ScrollToTop";
import AboutUs from "./pages/AboutUs";
import Cancellation from "./pages/Cancellation";
import Complaint from "./pages/Complaint";
import TermsAndCondition from "./pages/TermsAndCondition";
import Privacy from "./pages/Privacy";
import PaymentBtn from "./components/PaymentBtn";
import PaymentComponent from "./components/PaymentComponent";
import LoginWithGoogle from "./components/LoginWithGoogle";

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const token = localStorage.getItem("token");
    const [usertoken, setToken] = useState(localStorage.getItem("token"));
    const [isToggle, setIsToggle] = useState(false);
    
    useEffect(() => {
        if (token != null) {
            setIsLogin(true);
            setToken(token);
        }
    }, [isLogin, isToggle]);

    function changeToggleState(state) {
        setIsToggle(state);
    }

    // booking testing

    const data = {
        adult_person: 2,
        advance_amount: 15888,
        booking_status: "Partially paid",
        btn: "Check Avalability",
        check_in_date: "2022-11-17",
        check_out_date: "2022-11-21",
        children: 0,
        coupon_code: "",
        guestsInputContent: "",
        infants: 0,
        order_date: "2022-11-08T07:12:29.362Z",
        order_time: "13:12",
        payadvance: 15888,
        payfull: 52960,
        total_guest: 2,
        villa: "61e4668e8caa453201e1f5fe",
        amount: 2000,
    };

    return (
        // <>
        //     <PaymentBtn data={data}  /> <br />
        //     <PaymentComponent /> <br />
        // </>
        <Router>
            <Header
                data={isLogin}
                isToggleSet={changeToggleState}
                isHeaderToggle={isToggle}
            />
            <ScrollToTop />
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/about-us" component={AboutUs} exact />
                <Route
                    path="/cancellation-policy"
                    component={Cancellation}
                    exact
                />
                <Route
                    path="/complaints-suggestions"
                    component={Complaint}
                    exact
                />
                <Route
                    path="/terms-and-conditions"
                    component={TermsAndCondition}
                    exact
                />
                <Route path="/privacy-policy" component={Privacy} exact />

                <Route
                    path="/villas/:destination"
                    component={Destination}
                    exact
                />
                <Route
                    path="/villas/mapview/:destination"
                    component={Mapview}
                    exact
                />

                <Route
                    path="/villas/:single/:vname"
                    component={SingleVilla}
                    exact
                />

                <Route path="/user/register/dashboard" exact>
                    <Register />
                </Route>
                <Route path="/user/login/dashboard" exact>
                    <Login />
                </Route>
                <Route path="/blogs" exact>
                    <BlogPage />
                </Route>
                <Route path="/get-quotation" exact>
                    <SendInquiry />
                </Route>
                <Route path="/user/myprofile/dashboard" exact>
                    <MyProfile data={usertoken} />
                </Route>
                <Route path="/user/logout/dashboard" exact>
                    <Logout />
                </Route>
                {/* <Route path="/site-map" exact component={}/> */}
                <Redirect to="/" />
            </Switch>
            <Footer />
        </Router>
    );
}

export default App;
