import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getDestination, searchData } from "../redux/action/villa-action";

class Footer extends Component {
    goDesination = (destination) => {
        this.props.search({
            destination: destination,
            guest: null,
            startdate: null,
            enddate: null,
        });
        const dest = encodeURIComponent(destination).replaceAll("%20", "-");

        this.props.history.push({
            pathname: `/villas/${dest}`,
            state: { destination: destination },
        });
        this.props.history.push(`/villas/${dest}`);
    };
    componentDidMount() {
        this.props.getdest();
    }
    render() {
        return (
            <div>
                {/* Footer Section Start */}
                <footer className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="footer-nav widget">
                                    <h4>All destinations</h4>
                                    <ul>
                                        {this.props.dest
                                            .slice(0, 10)
                                            .map((d) => (
                                                <li
                                                    onClick={() =>
                                                        this.goDesination(
                                                            d.destination
                                                        )
                                                    }
                                                    key={d.destination}
                                                    style={{
                                                        textTransform:
                                                            "capitalize",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {d.destination}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                <div className="footer-nav widget mt-5">
                                    <h4>Quick links</h4>
                                    <ul>
                                        <li>
                                            <Link to="/blogs">Blogs </Link>
                                        </li>
                                        <li>
                                            <Link to="/about-us">About us</Link>
                                        </li>
                                        {/* <li>
                      <Link to="contact">Contact us</Link>
                    </li> */}

                                        <li>
                                            <Link to="/privacy-policy">
                                                Privacy policy
                                            </Link>
                                        </li>
                                        {/* <li>
                      <Link to="/complaints-suggestions">Complaint &amp; Suggestions </Link>
                    </li> */}
                                        <li>
                                            <Link to="/terms-and-conditions">
                                                Terms &amp; Conditions
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/cancellation-policy">
                                                Cancellation Policy
                                            </Link>
                                        </li>
                                        <li>
                                            <a
                                                href="https://pawnacamp.com/leecomplaints"
                                                target="_blank"
                                            >
                                                Complaints & Suggestions
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/site-map.xml">Sitemap</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
                {/* Footer Section End */}
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    dest: state.villa.alldest,
});
const mapDispatchToProps = (dispatch) => {
    return {
        search: (data) => dispatch(searchData(data)),
        getdest: () => dispatch(getDestination()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Footer));
