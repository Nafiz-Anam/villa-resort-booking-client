import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { getDestinationVilla, getVilla } from "../redux/action/villa-action";
import { withRouter } from "react-router-dom";
import { SERVER_URL } from "../config";

class SingleVillaCarousel extends Component {
  state = {
    next: 0,
    prev: 0,
    totalVilla: this.props.villa.data.villainfo.length,
  };

  componentDidMount() {}
  renderClickedVilla = () => {};
  componentDidUpdate(prevProp, prevState) {
    if (prevProp.seleted_villId !== this.props.seleted_villId) {
      this.setState({ next: this.props.seleted_villId });
    }
  }
  changeNextPage = () => {
    if (this.state.next + 1 < this.state.totalVilla) {
      this.setState({ next: this.state.next + 1 });
      this.props.setSelectedVillaId(this.state.next + 1);
    }
  };
  changePrevPage = () => {
    if (this.state.next - 1 >= 0) {
      this.setState({ next: this.state.next - 1 });
      this.props.setSelectedVillaId(this.state.next - 1);
    }
  };
  single_Villa = (id, vname, destname) => {
    const value = encodeURIComponent(vname).replaceAll("%20", "-");
    const dest = encodeURIComponent(destname).replaceAll("%20", "-");

    this.props.history.push(`/villas/${dest}/${value}`);
  };
  render() {
    let v = this.props.villa.data.villainfo[this.state.next];
    
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    if (this.props.villa.status == false || !v) {
      return <div>No villa found</div>;
    }
    return (
      <>
        <div className="col-lg-4 col-sm-6" style={{ paddingTop: "75px" }}>
          <div className="villa-entry">
            <div className="villa-img">
              <div className="batch">
                <img src="assets/images/bookmark.png" alt="" />
              </div>

              <Slider {...settings}>
                {v.villa_photos.slice(0,6).map((p) => (
                  <img
                    src={`${SERVER_URL}/${p}`}
                    alt=""
                    height="300px"
                    width="300px"
                    className="villa-img-div"
                    onClick={() =>
                      this.single_Villa(
                        v._id,
                        v.villa_name,
                        this.props.villa.data.destination
                      )
                    }
                  />
                ))}

                {/* <img src="assets/images/tvil4.jpg" alt="" /> */}
                {/* <img src="assets/images/tvil5.jpg" alt="" />
                    <img src="assets/images/tvil3.jpg" alt="" /> */}
              </Slider>
            </div>
            <div className="villa-txt">
              <h4
                style={{ cursor: "pointer" }}
                onClick={() =>
                  this.single_Villa(
                    v._id,
                    v.villa_name,
                    this.props.villa.data.destination
                  )
                }
              >
                {v.villa_name}{" "}
                <span>
                  <i className="fa fa-star" /> {v.villa_rating} (
                  {v.total_rating})
                </span>
              </h4>
              <div className="villa-meta">
                <span>
                  in {this.props.villa.data.destination} with {v.no_of_rooms}{" "}
                  rooms for {v.standard_capacity}-{v.max_capacity} guests
                </span>
                <span>
                  Sun to Fri: ₹{v.weekday_price}/night - Sat: ₹{v.weekend_price}
                  /night
                </span>
              </div>
            </div>
          </div>
          <div className="dest-pagination-btn">
            <span
              onClick={() => this.changePrevPage()}
              style={{ cursor: "pointer" }}
            >
              {"<<"} Prev
            </span>
            <span>
              {" "}
              {this.state.next + 1} out of{" "}
              {this.props.villa.data.villainfo.length}{" "}
            </span>
            <span
              onClick={() => this.changeNextPage()}
              style={{ cursor: "pointer" }}
            >
              Next {" >>"}
            </span>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({ villa: state.villa.destVilla });

export default connect(mapStateToProps, null)(withRouter(SingleVillaCarousel));
