import React, { Component } from "react";

import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  withStateHandlers,
} from "react-google-maps";
import { connect } from "react-redux";
import { URL, SERVER_URL } from "../config";
import "../App.css";
const labelSize = { width: 220 };
const labelPadding = 8;
const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDCA8TkShdYJDMaOjbIYyabFUMY3QzNWvQ&libraries=geometry,drawing,places",
    loadingElement: <div className="loadingElement" />,
    containerElement: <div className="containerElement" />,
    mapElement: <div className="mapElement" />,
  }),

  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{
      lat: Number(props.marker.data.villainfo[props.markerIndex].latitude),
      lng: Number(props.marker.data.villainfo[props.markerIndex].longitude),
    }}
  >
    {props.isMarkerShown &&
      props.marker.data.villainfo.map((marker, index) => {
        
        if(index==0 && index == props.markerIndex){
          return (
          <Marker
            position={{
              lat: Number(marker.latitude),
              lng: Number(marker.longitude),
            }}
            icon={{
              // url:`https://toppng.com/uploads/preview/in-location-map-icon-navigation-symbol-ma-google-maps-marker-blue-11562916561qaf3tyejum.png`,
              url:`${URL}/assets/images/grey_map_pin.svg`,

              scaledSize: new window.google.maps.Size(42, 42),
              // anchor: new window.google.maps.Point(32,32)
              
            }}
            onClick={() => {
              props.onMarkerClick(index);
            }}
            title={marker.villa_name}
            label={{text:marker.villa_name, color: "red", fontWeight: "bold"}}
            labelStyle={{ textAlign: "center",
            width: labelSize.width + "px",
            backgroundColor: "#7ff0c4",
            fontSize: "14px",
            padding: labelPadding + "px"}}
            labelAnchor={{ x: labelSize.width / 2 + labelPadding, y: 80 }}

            

          />
        ) 
        }
        else {
        return index == props.markerIndex ? (
          <Marker
            position={{
              lat: Number(marker.latitude),
              lng: Number(marker.longitude),
            }}
            
            icon={{
                
            // url:`https://toppng.com/uploads/preview/in-location-map-icon-navigation-symbol-ma-google-maps-marker-blue-11562916561qaf3tyejum.png`,
              url:`${URL}/assets/images/grey_map_pin.svg`,

              // anchor: new window.google.maps.Point(5, 58)
              scaledSize: new window.google.maps.Size(42, 42),
            }}
            onClick={() => {
              props.onMarkerClick(index);
            }}
            title={marker.villa_name}
            label={{text:marker.villa_name, color: "red",marginLeft:"40px", fontWeight: "bold",background:"yellow" }}
            labelStyle={{ textAlign: "center",
            width: labelSize.width + "px",
            backgroundColor: "#7ff0c4",
            fontSize: "14px",
            padding: labelPadding + "px"}}
            labelAnchor={{ x: labelSize.width / 2 + labelPadding, y: 80 }}
          />
        ) : (
          <Marker
            position={{
              lat: Number(marker.latitude),
              lng: Number(marker.longitude),
            }}
            icon={{
                
              // url:`https://toppng.com/uploads/preview/in-location-map-icon-navigation-symbol-ma-google-maps-marker-blue-11562916561qaf3tyejum.png`,
                url:`${URL}/assets/images/blue_map_pins.svg`,
  
                // anchor: new window.google.maps.Point(5, 58)
                scaledSize: new window.google.maps.Size(42, 42),
              }}
             
            onClick={() => props.onMarkerClick(index)}
            title={marker.villa_name}
            // label={marker.villa_name}

          />
        );
        }
      })
    }
  </GoogleMap>
));

class MyFancyComponent extends React.PureComponent {
  state = {
    isMarkerShown: true,
    markerIndex: 0,
  };

  componentDidMount() {
    this.delayedShowMarker();
  //   this.handleMarkerClick(1);

  //   this.handleMarkerClick(0);
  }

  delayedShowMarker = () => {
    this.setState({ isMarkerShown: true });

    // setTimeout(() => {
    //   this.setState({ isMarkerShown: true });
    // }, 1000);
  };
  componentDidUpdate(prevProp, prevState) {
    if (prevProp.seleted_villId !== this.props.seleted_villId) {
      // alert(this.props.seleted_villId)
      this.setState({ markerIndex: this.props.seleted_villId });
    }
  }
  handleMarkerClick = (id) => {
    this.props.setSelectedVillaId(id);
    this.setState({ markerIndex: id });

    this.delayedShowMarker();
  };

  render() {
    // alert(this.props.seleted_villId)
    return (
      <MyMapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        marker={this.props.villa}
        markerIndex={this.state.markerIndex}
      />
    );
  }
}
const mapStateToProps = (state) => ({ villa: state.villa.destVilla });

export default connect(mapStateToProps, null)(MyFancyComponent);
