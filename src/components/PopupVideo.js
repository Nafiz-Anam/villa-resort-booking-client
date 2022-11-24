import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import "../App.css";

function PopupVideo(props) {
  // if toggler is updated when lightbox is closed it will open it
  // if toggler is updated when lightbox is opened it will close it
  const [toggler, setToggler] = useState(false);
  const [videoLink, setVideoLink] = useState(
    "https://www.youtube.com/watch?v=KjyFwIPLKzk"
  );
  return (
    <>
      <div className="center-play">
        <button onClick={() => setToggler(!toggler)} className="play-video-btn">
          <i className="fa fa-play" />
        </button>
      </div>
      <FsLightbox
        toggler={toggler}
        sources={[props.videoURl ? props.videoURl : videoLink]}
      />
    </>
  );
}

export default PopupVideo;
