import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { getDestinationVilla, getVilla } from "../redux/action/villa-action";
import { withRouter } from "react-router-dom";
import { SERVER_URL } from "../config";
import villaService from "../services/service";
import { URL } from "../config";
import swal from "sweetalert";

class VillaCarousel1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isbookmark: false,
            headers: false,
        };
    }
    componentDidMount() {
        //
        //  var data = {
        //    "destination":this.props.history.location.state.destination
        //  }
        //  this.props.destvilla(data)
    }

    addBookmark = (id) => {
        if (this.props.user.data == null) {
            swal("Please login", "", "error");
        } else {
            let headers = {
                Authorization: this.props.user.data.data.token, //the token is a variable which holds the token
            };
            let bookmark = villaService.addBookmark({ villa: id }, headers);
            bookmark.then((res) => {
                if (res.status) {
                    this.setState({ isbookmark: true });
                }
            });
        }
    };
    checkBookMark = async (id) => {
        if (this.props.user.data != null) {
            let headers = {
                Authorization: this.props.user.data.data.token, //the token is a variable which holds the token
            };
            let bookmark = await villaService.checkBookmark(
                { villa: id },
                headers
            );

            if (bookmark.data.status) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    removeBookmark = async (id) => {
        if (this.props.user.data != null) {
        } else {
            let headers = {
                Authorization: this.props.user.data.data.token, //the token is a variable which holds the token
            };
            let bookmark = await villaService.removeBookmark(
                { villa: id },
                headers
            );
        }
    };

    single_Villa = (id, vname, destname) => {
        const value = encodeURIComponent(vname).replaceAll("%20", "-");
        const dest = encodeURIComponent(destname).replaceAll("%20", "-");

        this.props.history.push(`/villas/${dest}/${value}`);
    };
    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };
        if (this.props.villa.status == false) {
            return <div style={{ maxHeight: "548px" }}>No villa found</div>;
        }
        return (
            <>
                {this.props.villa.data.villainfo
                    .slice(0, this.props.seemore)
                    .map((v) => (
                        <div
                            className="col-lg-4 col-sm-6"
                            style={{ marginTop: "20px" }}
                        >
                            <div className="villa-entry">
                                <div className="villa-img">
                                    <div className="batch">
                                        {/* {this.checkBookMark(v._id) ? (
                    <img
                      src={`${URL}/assets/images/bookedmark.jpg`}
                      alt=""
                      onClick={() => this.removeBookmark(v._id)}
                      height="30px"
                      width="20px"
                    />
                  ) : (
                    <img
                      src={`${URL}/assets/images/bookmarkb.png`}
                      alt=""
                      onClick={() => this.addBookmark(v._id)}
                    />
                  )} */}
                                    </div>

                                    {/* <Slider {...settings}>
                                        {v.villa_photos.slice(0, 6).map((p) => (
                                            <img
                                                className="img-style"
                                                src={`${SERVER_URL}/${p}`}
                                                alt=""
                                                height="300px"
                                                width="300px"
                                                key={p}
                                                onClick={() =>
                                                    this.single_Villa(
                                                        v._id,
                                                        v.villa_name,
                                                        this.props.villa.data
                                                            .destination
                                                    )
                                                }
                                                style={{ cursor: "pointer" }}
                                            />
                                        ))}
                                        {/* <img src="assets/images/tvil4.jpg" alt="" /> */}
                                        {/* <img src="assets/images/tvil5.jpg" alt="" />
                  <img src="assets/images/tvil3.jpg" alt="" /> */}
                                    </Slider> */}
                                </div>
                                <div className="villa-txt">
                                    <h4
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            this.single_Villa(
                                                v._id,
                                                v.villa_name,
                                                this.props.villa.data
                                                    .destination
                                            )
                                        }
                                    >
                                        {v.villa_name}{" "}
                                        <span>
                                            <i className="fa fa-star" />{" "}
                                            {v.villa_rating} ({v.total_rating})
                                        </span>
                                    </h4>
                                    <div className="villa-meta">
                                        <span>
                                            in{" "}
                                            {this.props.villa.data.destination}{" "}
                                            with {v.no_of_rooms} rooms for{" "}
                                            {v.standard_capacity}-
                                            {v.max_capacity} guests
                                        </span>
                                        <span>
                                            Sun to Fri: ₹{v.weekday_price}/night
                                            - Sat: ₹{v.weekend_price}/night
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    villa: state.villa.destVilla,
    user: state.login_user,
});
const mapDispatchToprops = (dispatch) => {
    return {
        getvilla: () => dispatch(getVilla()),
        destvilla: (data) => dispatch(getDestinationVilla(data)),
    };
};
// export default connect(null,{loginUser})(Login)
export default connect(
    mapStateToProps,
    mapDispatchToprops
)(withRouter(VillaCarousel1));
