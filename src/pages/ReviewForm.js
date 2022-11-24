import { convertNeSwToNwSe } from "google-map-react";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import { addVillaReview } from "../redux/action/villa-action";

class ReviewForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            review: "",
            villa: "",
            user: "",
        };
    }
    componentDidMount() {
        const villaId = this.props.data.villaId;

        const userData = this.props.user;
        if (userData.data && userData.data.status == true) {
            const user = userData.data.data._id;
            this.setState({ user: user, villa: villaId });
        } else {
            swal("Please Login", "", "error");
            this.props.history.push("/user/login/dashboard");
        }
    }
    handleOnSubmit = async (e) => {
        e.preventDefault();
        let data = this.state;
        if (data.review.trim() == "") {
            swal("Please Enter the review", "", "error");
        } else {
            let res = await this.props.reviewData(data);

            this.props.review();
        }
    };
    render() {
        return (
            <div style={{ marginBottom: "18px" }}>
                Add Your Review
                <textarea
                    placeholder="Add Review"
                    value={this.state.review}
                    onChange={(e) => this.setState({ review: e.target.value })}
                />
                <button
                    className="btn btn btn-outline-dark "
                    onClick={this.handleOnSubmit}
                >
                    Submit
                </button>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.login_user,
    };
};
const mapDispatchToprops = (dispatch) => {
    return {
        reviewData: (data) => dispatch(addVillaReview(data)),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToprops
)(withRouter(ReviewForm));
// 66109010
