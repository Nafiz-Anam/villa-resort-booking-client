import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";

import { getRecentReview } from "../redux/action/villa-action";
import villaService from "../services/service";
class ReviewSlide extends Component {
    state = {
        review: [],
        status: false,
    };
    async componentDidMount() {
        await this.props.get_review();
    }

    render() {
        const settings = {
            slidesToShow: 4,
            dots: true,
            slidesToScroll: 1,
            infinite:
                this.props.review.data && this.props.review.data.length > 2
                    ? true
                    : false,
            autoplay: true,

            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 1,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                    },
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                    },
                },
            ],
        };

        return (
            <div>
                {/* Review Section Start */}

                <Slider {...settings} className="review-slide">
                    {/* Single Quote End */}
                    {this.props.review.data &&
                        this.props.review.data.map((r) => (
                            <div
                                className="single-quote"
                                style={{ width: "300px", height: "200px" }}
                                key={r.user.name}
                            >
                                <div className="quote-head">
                                    <span>
                                        <img
                                            src="assets/images/rev2.png"
                                            alt=""
                                        />
                                    </span>
                                    <div className="quote-inner">
                                        <h4>{r.user.name}</h4>
                                        <span>
                                            <i className="fa fa-star" />{" "}
                                            {r.villa && r.villa.villa_rating}/5
                                            for {r.villa && r.villa.villa_name}
                                        </span>
                                    </div>
                                </div>
                                <p
                                    style={{ overflowWrap: "break-word" }}
                                    dangerouslySetInnerHTML={{
                                        __html: r.review.slice(0, 300) + "...",
                                    }}
                                ></p>

                                {/* <p className="review-date">Posted on 2 April 2021</p> */}
                            </div>
                        ))}
                </Slider>
                {/* Review Section End */}
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    review: state.recentreview,
});

const maptDispatchToProps = (dispatch) => ({
    get_review: () => dispatch(getRecentReview()),
});

export default connect(mapStateToProps, maptDispatchToProps)(ReviewSlide);
