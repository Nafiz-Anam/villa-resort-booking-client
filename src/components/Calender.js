import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DayPicker } from "react-dates";
import "../calendar.css";
const moment = require("moment");

function getDates(mark) {
  var dateArray = [];
  for (var i in mark) {
    if(["Paid","Partially paid","On-hold"].includes(mark[i].booking_status) && mark[i].is_active==true){

    var currentDate = moment(mark[i].check_in_date);
    var stopDate = moment(mark[i].check_out_date);
    while (currentDate < stopDate) {
      dateArray.push(moment(currentDate).format("DD-MM-YYYY"));
      currentDate = moment(currentDate).add(1, "days");
    }
  }
}
  return dateArray;
}
function DateCalender(props) {
  let now = new Date();
  let current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const [value, setValue] = useState(props.date);
  // if(props.nextMonth){
  //   setValue(now)
  // }
  // props.nextMonth ? setValue(current) : setValue(now)
  // if(props.nextMonth) {
  //   setValue(current)
  // }

  const mark = [
    {
      check_in_date: "2021-07-25",
      check_out_date: "2021-07-28",
    },
  ];
  function today(day) {
    return day.isBefore(new Date(), "day");
  }

  let markdate = getDates(props.dates);
  return (
    <div>
      <Calendar
        showNavigation={true}
        onChange={setValue}
        value={value}
        tileClassName={({ date, view }) => {
          if (markdate.find((x) => x === moment(date).format("DD-MM-YYYY"))) {
            return "highlight weekcolor";
          }

          if (moment().subtract(1, "days").isAfter(moment(date))) {
            return "highlight weekcolor";
          }
          if (date.getDay() === 6 || date.getDay() == 0) {
            return "weekcolor";
          }
          if (today(moment())) {
            return "today";
          }
        }}
        tileDisabled={({ date, view }) => {
          if (markdate.find((x) => x === moment(date).format("DD-MM-YYYY"))) {
            return date;
          }
          if (moment().subtract(1, "days").isAfter(moment(date))) {
            return date;
          }
        }}
      />
    </div>
  );
}

export default DateCalender;
