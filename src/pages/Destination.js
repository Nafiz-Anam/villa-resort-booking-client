import React, { Component } from "react";
import { Link } from "react-router-dom";
import Booking2 from "../components/Booking-2";
import VillaCarousel from "../components/VillaCarousel";
import Review from "../components/DestinationReview";
import PopupVideo from "../components/PopupVideo";
import { connect } from "react-redux";
import {
    getDestinationVilla,
    getQuestion,
    searchData,
} from "../redux/action/villa-action";
import { Helmet } from "react-helmet";

export class Destination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            destination: "",
            seemore: 9,
            isSeeMore: true,
        };
    }

    componentDidMount() {
        this.setState({
            destination: this.props.match.params.destination.replaceAll(
                "-",
                " "
            ),
        });

        var data = {
            destination: this.props.match.params.destination.replaceAll(
                "-",
                " "
            ),
            guest: this.props.searchdata.guest,
            startdate: this.props.searchdata.startdate
                ? this.props.searchdata.startdate
                : null,
            enddate: this.props.searchdata.enddate
                ? this.props.searchdata.enddate
                : null,
        };
        this.props.search(data);

        this.setState({
            id: this.props.match.params.destination.replaceAll("-", " "),
            destination: this.props.match.params.destination.replaceAll(
                "-",
                " "
            ),
        });
        this.props.getquestion();
        this.props.destVilla(data);
        this.props.search(data);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // If Route has changed, update state (Ensures consistency between location state and Component state).
        if (this.props.location !== prevProps.location) {
            var data = {
                destination: this.props.match.params.destination.replaceAll(
                    "-",
                    " "
                ),
                guest: this.props.searchdata.guest,
                startdate: this.props.searchdata.startdate
                    ? this.props.searchdata.startdate
                    : null,
                enddate: this.props.searchdata.enddate
                    ? this.props.searchdata.enddate
                    : null,
            };
            this.setState(this.props.location.state);

            this.setState({
                destination: this.props.match.params.destination.replaceAll(
                    "-",
                    " "
                ),
            });
            this.props.destVilla(this.props.searchdata);
            this.props.search(data);
        }
    }
    handleOnSearch(data) {
        this.props.destVilla(this.props.searchdata);
    }

    render() {
        if (
            this.props.destvilla === null ||
            this.props.destvilla.status == false
        ) {
            return (
                <div>
                    <section className="form-section">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <Booking2
                                        data={this.props.searchdata}
                                        handleSearch={() =>
                                            this.handleOnSearch()
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="space-btwn-bottom">
                        No villas available on your date, Please call 8181909069
                        for more options
                    </div>
                </div>
            );
        }
        return (
            <div>
                <Helmet>
                    <meta
                        name="description"
                        content={this.props.destvilla.data.destination}
                    />
                </Helmet>
                <section className="form-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <Booking2
                                    data={this.props.searchdata}
                                    handleSearch={() => this.handleOnSearch()}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                {/* Banner Section End */}
                {/* Top Villa Section Start */}
                <section className="top-villa section-padding">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 mb-3">
                                <h2 className="section-title">
                                    Villas in{" "}
                                    {this.props.destvilla.data.destination}
                                </h2>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.destvilla.data
                                            .short_description,
                                    }}
                                >
                                    {/* {this.props.destvilla.data.short_description} */}
                                </p>
                            </div>
                        </div>
                        {this.props.destvilla.data.villainfo.length === 0 ? (
                            <div className="space-btwn-bottom">
                                No villas available on your date, Please call
                                8181909069 for more options
                            </div>
                        ) : null}
                        <div className="row">
                            <VillaCarousel
                                seemore={this.state.seemore}
                                isSeeMore={this.state.isSeeMore}
                            />

                            <div className="col-lg-12 text-center mt-3">
                                {this.props.destvilla.data.villainfo.length >
                                this.state.seemore ? (
                                    <button
                                        className="btn  btn-warning"
                                        onClick={() =>
                                            this.setState({
                                                seemore: this.state.seemore + 1,
                                            })
                                        }
                                    >
                                        See More
                                    </button>
                                ) : (
                                    <></>
                                )}
                                {/* <Link to="#" className="custom-btn">
                  See More
                </Link> */}
                            </div>
                        </div>
                    </div>
                </section>
                {/* Top Villa Section End */}
                {/* About Section Start */}
                <section className="about-section">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-sm-6">
                                <div className="about-txt">
                                    <h3>We are</h3>
                                    <p>
                                        Thinking about a holiday with your
                                        family, friends, or with your
                                        colleagues? Leestays offer you clean,
                                        cozy and spacious private villas as well
                                        as bungalows creating a supreme holiday
                                        experience. Being a tourist spot
                                        Lonavala is also known for its beautiful
                                        villas and bungalows giving you a
                                        pre-eminent experience. Exclusively
                                        meant for our guests and have a
                                        wonderful vacation. Inspired by the
                                        paradise living area our villas give you
                                        exquisite bedrooms that lead directly
                                        towards the beautiful garden and pool
                                        view. On the other hand, feel the cool
                                        breeze of exotic Lonavala hill station
                                        which offers you a dazzling sight of its
                                        beauty.
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-6">
                                <div className="about-img">
                                    <img
                                        src="/assets/images/about_1.jpg"
                                        alt="About"
                                    />
                                    <PopupVideo />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* About Section End */}
                {/* Choose Section Start */}
                <section className="choose-section section-padding">
                    <div className="container">
                        <h2 className="section-title mb-4 text-center">
                            Why choose Leestays?
                        </h2>
                        <div className="row">
                            <div className="col-lg-3 col-sm-3">
                                <div className="choose-item text-center">
                                    <span>
                                        <img
                                            src="/assets/images/check.svg"
                                            alt=""
                                        />
                                    </span>
                                    <p>Daily Checks</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-3">
                                <div className="choose-item text-center">
                                    <span>
                                        <img
                                            src="/assets/images/quality.svg"
                                            alt=""
                                        />
                                    </span>
                                    <p>Quality Personal Care</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-3">
                                <div className="choose-item text-center">
                                    <span>
                                        <img
                                            src="/assets/images/support.svg"
                                            alt=""
                                        />
                                    </span>
                                    <p>24x7 Call Support</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-3">
                                <div className="choose-item text-center">
                                    <span>
                                        {" "}
                                        <img
                                            src="/assets/images/bed.svg"
                                            alt=""
                                        />
                                    </span>
                                    <p>White Bedding</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Choose Section End */}
                {/* Review Section Start */}
                <section className="review">
                    <div className="container">
                        <h2 className="section-title mb-5 text-center">
                            Recent Reviews
                        </h2>
                        <div className="row">
                            <div className="col-lg-12">
                                <Review destination={this.state.id} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="faq-wrap mt-5">
                                    <h2 className="section-title mb-4">
                                        What You’ll Find In{" "}
                                        {this.props.destvilla.data.destination}
                                    </h2>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: this.props.destvilla.data
                                                .description,
                                        }}
                                    ></p>
                                    <div className="accordion" id="faq-wrapper">
                                        {this.props.question.map((q) => (
                                            <div
                                                className="faq-item"
                                                key={q._id}
                                            >
                                                <div
                                                    className="faq-header"
                                                    id={`heading${q._id}`}
                                                >
                                                    <h4
                                                        className="faq-title"
                                                        data-toggle="collapse"
                                                        data-target={`#collapse${q._id}`}
                                                        aria-expanded="false"
                                                        aria-controls={`collapse${q._id}`}
                                                    >
                                                        {q.question}
                                                    </h4>
                                                </div>
                                                <div
                                                    id={`collapse${q._id}`}
                                                    className="collapse faq-content"
                                                    aria-labelledby={`heading${q._id}`}
                                                    data-parent="#faq-wrapper"
                                                >
                                                    <div className="faq-text">
                                                        Ans: {q.answer}.
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/*End Faq Order*/}
                                        {/* <div className="faq-item">
                      <div className="faq-header" id="heading-3">
                        <h4
                          className="faq-title collapsed"
                          data-toggle="collapse"
                          data-target="#collapse-3"
                          aria-expanded="false"
                          aria-controls="collapse-3"
                        >
                          What are check-in and checkout timings?{" "}
                        </h4>
                      </div>
                      <div
                        id="collapse-3"
                        className="collapse faq-content"
                        aria-labelledby="heading-3"
                        data-parent="#faq-wrapper"
                      >
                        <div className="faq-text">
                          Consectetur adipisicing elit. Minima cumque voluptatum
                          deleniti nesciunt debitis itaque.
                        </div>
                      </div>
                    </div>*/}
                                    </div>{" "}
                                    {/* Accordion End */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Review Section End */}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    searchdata: state.searchdata,
    destvilla: state.villa.destVilla,
    question: state.question,
});
const mapDispatchToprops = (dispatch) => {
    return {
        search: (data) => dispatch(searchData(data)),
        destVilla: (data) => dispatch(getDestinationVilla(data)),
        getquestion: () => dispatch(getQuestion()),
    };
};
// export default connect(null,{loginUser})(Login)
export default connect(mapStateToProps, mapDispatchToprops)(Destination);
