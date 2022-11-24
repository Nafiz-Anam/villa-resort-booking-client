import React, { useEffect } from 'react';
import { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Slider from "react-slick";
import { SERVER_URL } from '../config';

import { getVilla } from '../redux/action/villa-action';

function TopVilla(props) {
    let history = useHistory()
    const settings = {
        dots: true,
        infinite:true,
        arrows: true,
        focusOnSelect: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const singleVilla = (id,vname,destname) => {
        const value = encodeURIComponent(vname).replaceAll('%20','-');
        const dest = encodeURIComponent(destname).replaceAll('%20','-');
        
        // const url = 'http://example.com?lang=en&key=' + value
        history.push(`/villas/${dest}/${value}`)
       }
    // const dispatch = useDispatch()
    // const villa = useSelector((state) => state.villa)

    // const [topVillas, settopVillas] = useState([
    //     { src: 'tvil3.jpg' , title: 'Festoon villa', rating: '4.3(33)', meta1: 'in Feston with 4 rooms for 15-20 guests', meta2: 'Sun to Fri: ₹10990/night - Sat: ₹17990/night', id: 1 },
    //     { title: 'Hennessy villa', rating: '4.3(33)', meta1: 'in Lonavala with 4 rooms for 15-20 guests', meta2: 'Sun to Fri: ₹11990/night - Sat: ₹19990/night', id: 2 },
    //     { title: 'Lonavala haveli', rating: '4.2(13)', meta1: 'in Lonavala with 4 rooms for 15-20 guests', meta2: 'Sun to Fri: ₹10990/night - Sat: ₹17990/night', id: 3 },
    //     { title: 'Festoon villa', rating: '4.5(23)', meta1: 'in Lonavala with 4 rooms for 15-20 guests', meta2: 'Sun to Fri: ₹10990/night - Sat: ₹17990/night', id: 4 },
    // ]);
    // const [topVillas, setTopVillas] = useState([villa.data.data])
    const [topVillas, setTopVillas] = useState([])

    const [limit,setLimit]=useState(props.limit)
    useEffect( async () => {
        
        
        await props.getvilla(props.limit);
        // dispatch(getVilla())

        await setTopVillas(props.villa.data)
        

    },[props.limit])
    return (
        
        <div className="row">
            { props.villa.status && props.villa.data.data.map((tvilla) => (
                <div className="col-lg-4 col-sm-6" key={tvilla._id} style={{display:'table-cell'}}  >
                    <div className="villa-entry" style={{marginTop:'20px'}} >
                        <div className="villa-img">
                            {/* <div className="batch"><img src="assets/images/bookmark.png" alt="" /></div> */}
                            <Slider {...settings}>  
                                {tvilla.villa_photos.slice(0,6).map((p) => (
                                <img className="img-style" src={`${SERVER_URL}/${p}`} alt="" height="300px" width="300px" onClick={() => singleVilla(tvilla._id,tvilla.villa_name,tvilla.destination.destination)}/>
                                
                                ))}
                                {/* <img src="assets/images/tvil4.jpg" alt="" /> */}
                                {/* <img src="assets/images/tvil5.jpg" alt="" />
                                <img src="assets/images/tvil3.jpg" alt="" /> */}
                            </Slider> 
                        </div>
                        <div className="villa-txt" >
                            <h4 style={{cursor:'pointer'}} onClick={() => singleVilla(tvilla._id,tvilla.villa_name,tvilla.destination.destination)}>{tvilla.villa_name} <span><i className="fa fa-star" /> {`${tvilla.villa_rating}(${tvilla.total_rating})`}</span></h4>
                            <div className="villa-meta">
                                <span>{`in ${tvilla.destination.destination} with ${tvilla.no_of_rooms} rooms for ${tvilla.standard_capacity}-${tvilla.max_capacity} guests`}</span>
                                <span>{`Sun to Fri: ₹${tvilla.weekday_price}/night - Sat: ₹${tvilla.weekend_price}/night`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div className="row">
            <div className="col">
            {/* <button type="button" className="primary" onClick={() => setLimit(limit+6)}>See More</button> */}

            </div>
            </div>

        </div>


    );
}

const mapStateToProps = state => {
    return {
        villa:state.villa
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getvilla:(limit) => dispatch(getVilla(limit))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)( TopVilla);