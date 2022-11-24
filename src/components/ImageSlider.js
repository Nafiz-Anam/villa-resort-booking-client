import React, { Component } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { URL, SERVER_URL } from "../config";

const imagess = [
  "//placekitten.com/1500/500",
  "//placekitten.com/4000/3000",
  "//placekitten.com/800/1200",
  "//placekitten.com/1500/1500",
];

class ImageSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
    };
  }
  handleClick = () => {
    this.props.setParentstate(false);
  };

  render() {
    const { photoIndex } = this.state;
    const images = this.props.images;
    const isOpen = this.props.isOpen;

    return (
      <div>
        {/* <button
          type="button"
          style={{ backgroundColor: "#000032", borderColor: "#000032" }}
          className="btn btn-sm btn-secondary "
          onClick={() => this.setState({ isOpen: true })}
        >
          All images
        </button> */}

        {isOpen && (
          <Lightbox
            mainSrc={`${SERVER_URL}/${images[photoIndex]}`}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={this.handleClick}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
      </div>
    );
  }
}
export default ImageSlider;
