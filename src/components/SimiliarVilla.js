import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";
import { SERVER_URL, URL } from "../config";
import { similarVilla } from "../redux/action/villa-action";

function SimiliarVilla(props) {
  let history = useHistory();
  const settings = {
    slidesToShow: 3,
    dots: false,
    slidesToScroll: 1,
    infinite: false,
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
  const [status, setStatus] = useState(false);
  const getSimilarVilla = async () => {
    await props.similar_villa({ destination: props.destination });
    setStatus(true);
  };
  const single_Villa = (id, vname, destname) => {
    // history.push(`/single-villa/${id}`)
    const value = encodeURIComponent(vname).replaceAll("%20", "-");
    const dest = encodeURIComponent(destname).replaceAll("%20", "-");

    window.location.href = `/villas/${dest}/${value}`;
  };
  useEffect(async () => {
    await getSimilarVilla();
  }, [status]);

  return (
    <>
      {/* Similiar Villa Start */}
      <div className="similiar-villa">
        <h3 className="subtitle">Similar villas </h3>
        <Slider {...settings} className="s-villa-carousel">
          {status &&
            props.similarVilla
              .filter((v) => v._id !== props.villa_id)
              .map((villa) => (
                <div className="villa-entry gaps" key={villa._id}>
                  <div className="villa-img">
                    {/* <div className="batch"><img src={`${URL}/assets/images/bookmark.png`} alt="" /></div> */}
                    <div className="villa-img">
                      <img
                        src={`${SERVER_URL}/${villa.villa_photos[0]}`}
                        alt=""
                        height="300px"
                        width="450px"
                        onClick={() =>
                          single_Villa(
                            villa._id,
                            villa.villa_name,
                            villa.destination.destination
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="villa-txt">
                    <h4
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        single_Villa(
                          villa._id,
                          villa.villa_name,
                          villa.destination.destination
                        )
                      }
                    >
                      {" "}
                      {villa.villa_name}{" "}
                      <span>
                        <i className="fa fa-star" /> {villa.rating}
                      </span>
                    </h4>
                    <div className="villa-meta">
                      <span>{`in ${villa.destination.destination} with ${villa.no_of_rooms} rooms for ${villa.standard_capacity}-${villa.max_capacity} guests`}</span>
                      <span>{`Sun to Fri: ₹${villa.weekday_price}/night - Sat: ₹${villa.weekend_price}/night`}</span>
                    </div>
                  </div>
                </div>
              ))}
        </Slider>
      </div>
      {/* Similiar Villa End */}
    </>
  );
}
const mapStateToProps = (state) => ({
  similarVilla: state.villa.similarvilla,
});

const mapDispatchToProps = (dispatch) => ({
  similar_villa: (data) => dispatch(similarVilla(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SimiliarVilla);
