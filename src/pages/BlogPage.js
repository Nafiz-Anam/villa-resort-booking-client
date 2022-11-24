import React, { Component } from "react";
import { Link } from "react-router-dom";
import villaService from "../services/service";
import { SERVER_URL } from "../config";
import "../App.css";
class BlogPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 0,
            blogs: [],
            isLoading: true,
            count: 0,
        };
    }

    componentDidMount() {
        window.scroll(0, 0);
        this.getBlog();
    }

    getBlog = () => {
        let data = villaService.getBlogs({
            limit: this.state.limit,
            page: this.state.page,
        });
        data.then((resp) => {
            let response = resp.data;

            if (response.status == true && response.data.length > 0) {
                this.setState({
                    blogs: response.data,
                    isLoading: false,
                    count: response.count,
                });
            }
        });
    };

    getNextBlog = (limit, page) => {
        if (this.state.blogs.length != 0) {
            this.setState(
                { limit: limit + 5, page: page + 1, isLoading: true },
                () => this.getBlog()
            );
        }
    };
    getPreviousBlog = (limit, page) => {
        if (this.state.limit - 5 >= 0 && this.state.page - 1 >= 0) {
            this.setState(
                { limit: limit - 5, page: page - 1, isLoading: true },
                () => this.getBlog()
            );
        }
    };

    render() {
        return (
            <div className="space-btwn-bottom">
                <ul className="list-group">
                    {!this.state.isLoading &&
                        this.state.blogs.map((b) => (
                            <li className="display-flex bd-highlight mt-3">
                                <div className="p-2 display-img">
                                    <Link to="#">
                                        <img
                                            src={`${SERVER_URL}/${b.blog_image}`}
                                            className="rounded float-left"
                                            alt=""
                                            height="200px"
                                            width="300px"
                                            alt=""
                                        ></img>
                                    </Link>
                                </div>
                                <div className="p-2 col marg">
                                    <h5>Title: {b.blog_title} </h5>
                                    Description:{" "}
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: b.discripton,
                                        }}
                                    ></p>
                                </div>
                                {/* <hr
                  style={{
                    color: "red",
                    backgroundColor: "red",
                    height: 5,
                  }}
                /> */}
                            </li>
                        ))}

                    <div className="d-flex justify-content-between">
                        <span
                            className="justify-content-between"
                            onClick={() =>
                                this.getPreviousBlog(
                                    this.state.limit,
                                    this.state.page
                                )
                            }
                            style={{ cursor: "pointer" }}
                        >
                            {this.state.limit > 5 ? <> {"<<-"} Prev </> : null}
                        </span>

                        {(this.state.page + 1) * 5 < this.state.count ? (
                            <span
                                className="justify-content-between"
                                onClick={() =>
                                    this.getNextBlog(
                                        this.state.limit,
                                        this.state.page
                                    )
                                }
                                style={{ cursor: "pointer" }}
                            >
                                {" "}
                                Next {"->>"}{" "}
                            </span>
                        ) : null}
                    </div>
                </ul>
            </div>
        );
    }
}

export default BlogPage;
