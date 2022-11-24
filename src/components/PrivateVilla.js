import React, { useEffect } from "react";
import { useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { SERVER_URL } from "../config";
import villaService from "../services/service";
import { Link, useHistory } from "react-router-dom";
import { getDestination, searchData } from "../redux/action/villa-action";
import { connect } from "react-redux";

function PrivateVilla(props) {
  const [dest, setDest] = useState([]);
  useEffect(async () => {
    //    let destdata = await villaService.getDestination()
    //    setDest(destdata.data.data)
    props.getdest();
  }, []);
  const history = useHistory();

  const handleOnClick = async (destination) => {
    props.search({
      destination: destination,
      guest: null,
      startdate: null,
      enddate: null,
    });
    const dest = encodeURIComponent(destination).replaceAll('%20','-');
    history.push({
      pathname: `/villas/${dest}`,
      state: { destination: destination },
    });
  };

  // 
  const settings = {
    slidesToShow: 5,
    dots: true,
    slidesToScroll: 1,
    infinite: props.dest && props.dest.length >5? true:false,
    autoplay: true,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },

      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const [privateVillas, setprivateVillas] = useState([
    { src: "v1.jpg", id: 1 },
    { src: "v2.jpg", id: 1 },
    { src: "v3.jpg", id: 1 },
    { src: "v4.jpg", id: 1 },
    { src: "v5.jpg", id: 1 },
    { src: "v3.jpg", id: 1 },
    { src: "v1.jpg", id: 1 },
  ]);
  const style = {
    display: "flex",
    justifyContent: "space-around",
    textTransform: "capitalize",
  };

  return (
    <Slider {...settings} className="villa-wrap mt-5">
      {props.dest.map((pvilla) => (
        <div className="s-villa" key={pvilla._id} >
          {/* <img src={"assets/images/" + pvilla.src} alt="Villa" /> */}

          <img
          className="img-style"
            src={`${SERVER_URL}/${pvilla.destination_img}`}
            alt="Villa"
            onClick={() => {
              handleOnClick(pvilla.destination);
            }}
            height="150px"
            width="200px"
          />
          <div style={style}>{pvilla.destination}</div>
        </div>
      ))}
    </Slider>
  );
}

const mapStateToProps = (state) => ({
  dest: state.villa.alldest,
});
const mapDispatchToProps = (dispatch) => {
  return {
    getdest: () => dispatch(getDestination()),
    search: (data) => dispatch(searchData(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PrivateVilla);
