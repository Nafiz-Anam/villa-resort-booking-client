import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../config";

const PaymentBtn = ({ processBook, data }) => {
    const [click, setClick] = useState(false);
    useEffect(() => {
        if (click) {
            let options = {
                key: "rzp_live_HDTh41hmBphcZj",
                amount: data.amount, // 2000 paise = INR 20, amount in paisa
                name: "",
                description: "",
                order_id: "",
                handler: function (response) {
                    console.log("rezorpay res => ", response);

                    let values = {
                        razorpay_signature: response.razorpay_signature,
                        razorpay_order_id: response.razorpay_order_id,
                        transactionid: response.razorpay_payment_id,
                        transactionamount: data.amount,
                    };

                    axios
                        // .post(`${SERVER_URL}/book/success/payment`, values)
                        .post(`localhost:5050/book/success/payment`, values)
                        .then((res) => {
                            console.log("payment res", res);

                            data["order_id"] = res.data.orderId;
                            data["payment_id"] = res.data.paymentId;
                            data["transaction_id"] = values.transactionid;
                            // parentProps.processBook(data);
                        })
                        .catch((e) => console.log(e));
                },

                prefill: {
                    name: data.guest_name,
                    email: data.guest_email,
                    contact: data.guest_mobile_no,
                },

                theme: {
                    color: "#528ff0",
                },
            };

            axios
                .post(`localhost:5050/book/order/payment`, { amount: 200000 })
                .then((res) => {
                    options.order_id = res.data.id;
                    options.amount = res.data.amount;
                    console.log("razorpay options => ", options);
                    var rzp1 = new window.Razorpay(options);
                    rzp1.open();
                })
                .catch((e) => console.log(e));
        }
    }, [click]);

    return (
        <button
            className="btn btn-warning btn-large mt-3"
            style={{ width: "250px", height: "48px" }}
            onClick={() => {
                setClick(true);
            }}
            // onClick={() => {
            //     this.openPayModal();
            // }}
            value="Continue"
        >
            Continue
        </button>
    );
};

export default PaymentBtn;
