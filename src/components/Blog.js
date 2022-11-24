import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Slider from "react-slick";
import http from "../http-common";

class Blog extends Component {
    state = {
        blog: [],
        isLoading: true,
    };
    async componentDidMount() {
        let data = await http.get("/villa/blog/active");

        this.setState({ blog: data.data.data, isLoading: false });
    }

    render() {
        const style = {};
        const settings = {
            slidesToShow: 4,
            dots: true,
            slidesToScroll: 1,
            infinite: this.state.blog.length > 3 ? true : false,
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

                <Slider {...settings} className="review-slide carousel">
                    {!this.state.isLoading &&
                        this.state.blog.map((b) => (
                            <div
                                className="single-quote item blog-item"
                                style={{
                                    width: "300px",
                                    maxHeight: "320px",
                                    overflow: "hidden",
                                }}
                                key={b.blog_title}
                            >
                                <div className="quote-head">
                                    Title: <div>{b.blog_title}</div>
                                </div>
                                <div>
                                    Description:{" "}
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                b.discripton.slice(0, 450) +
                                                "...",
                                        }}
                                    ></p>
                                    {/* <p className="review-date">Posted on 2 April 2021</p> */}
                                </div>
                            </div>
                        ))}
                </Slider>
                {/* Review Section End */}
            </div>
        );
    }
}

export default Blog;
