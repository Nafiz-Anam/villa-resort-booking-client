import React, { Component } from "react";
import { connect } from "react-redux";
import StarRatingComponent from "react-star-rating-component";
import swal from "sweetalert";
import { userRating } from "../redux/action/villa-action";
import villaService from "../services/service";

class Rating extends Component {
  constructor(props) {
    super(props);

    this.state = {
      [this.props.rating_type]: 0,
      prevRating: 0,
    };
  }
  componentDidMount() {
    if (this.props.user.data !== null && this.props.user.data.status == true) {
      this.getRating();
    }
  }
  getRating = async () => {
    let headers = {
      Authorization: this.props.user.data.data.token, //the token is a variable which holds the token
    };
    await this.props.userrating({ villa: this.props.villadetail.data._id }, headers);
    if (this.props.user_rating.status && this.props.user_rating.data) {
      let rating = this.props.user_rating.data.rating;

      rating.find((r) => {
        if (r.rating_type == this.props.rating_type) {
          this.setState({
            [this.props.rating_type]: r.rating,
            prevRating: r.rating,
          });
        }
      });

      
    }
  };

  async onStarClick(nextValue, prevValue, name) {
    await this.setState({ [this.props.rating_type]: nextValue });
    let keys = Object.keys(this.state);
    let data = {
      rating_type: name,
      rating: this.state[keys[0]],
      villa: this.props.villa,
      user: this.props.user.data.data._id,
    };
    this.addRating(data, name);
  }
  addRating = async (data, name) => {
    let headers = {
      Authorization: this.props.user.data.data.token, //the token is a variable which holds the token
    };
    let res = await villaService.addRating(data, headers);
    

    if (res.data.status == true) {
      swal(res.data.message,"","success");
      this.props.getrating();
    } else {
      swal(res.data.message,"","error");
      this.setState({ [this.props.rating_type]: this.state.prevRating });
    }
  };

  render() {
    const name = this.state[this.props.rating_type];
    if (
      this.props.user.data === null ||
      this.props.user.data.status === false
    ) {
      return <></>;
    }

    return (
      <div style={{ fontSize: "30px", marginTop: "20px" }}>
        <StarRatingComponent
          name={this.props.rating_type}
          starCount={5}
          value={name}
          onStarClick={this.onStarClick.bind(this)}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.login_user,
  user_rating: state.userrating,
  villadetail: state.villa.villadetail,

});
const mapDispatchToProps = (dispatch) => {
  return {
    userrating: (data, headers) => dispatch(userRating(data, headers)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Rating);
