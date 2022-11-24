import React, { useState } from "react";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

const DatePicker = ({
    startDateId,
    endDateId,
    form: { setFieldValue, setFieldTouched, values },
    // field,
    ...props
}) => {
    console.log(values);
    // const [startDate, setStartDpageate] = useState(null);
    // const [endDate, setEndDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    // const handleDatesChange = ({ startDate, endDate }) => {
    //   // setStartDate(startDate);
    //   // setEndDate(endDate);
    //   setFieldValue("startDate", startDate);
    //   setFieldValue("endDate", endDate);
    // };
    return (
        <DateRangePicker
            startDate={values.startDate}
            startDateId="Start"
            endDate={values.endDate}
            endDateId="End"
            onDatesChange={({ startDate, endDate }) => {
                setFieldValue("startDate", startDate);
                setFieldValue("endDate", endDate);
            }}
            numberOfMonths={1}
            focusedInput={focusedInput}
            onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
        />
    );
};

export default DatePicker;
