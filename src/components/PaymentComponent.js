import React from "react";
import axios from "axios";
import { SERVER_URL } from "../config";

class PaymentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.openPayModal = this.openPayModal.bind(this);
    }

    componentDidMount() {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }

    handleChange(evt) {
        console.log(evt.target.value);
        this.setState({
            amount: evt.target.value,
        });
    }

    openPayModal(amt) {
        const parentProps = this.props;
        const data = JSON.parse(this.props.data());

        console.log("payment page data => ", data.payadvance);

        var amount = 0; //Razorpay consider the amount in paise
        data.booking_status === "Partially paid"
            ? (amount = data?.payadvance * 100)
            : (amount = data?.payfull * 100);

        var options = {
            key: "rzp_test_AyHfrF6e7s1JbW",
            // key: "rzp_live_HDTh41hmBphcZj",
            amount: amount, // 2000 paise = INR 20, amount in paisa
            name: "",
            description: "",
            order_id: "",
            handler: function (response) {
                console.log("rezorpay res => ", response);
                var values = {
                    razorpay_signature: response.razorpay_signature,
                    razorpay_order_id: response.razorpay_order_id,
                    transactionid: response.razorpay_payment_id,
                    transactionamount: amount,
                };

                axios
                    .post(`${SERVER_URL}/book/success/payment`, values)
                    .then((res) => {
                        console.log("payment res", res);
                        data["order_id"] = res.data.orderId;
                        data["payment_id"] = res.data.paymentId;
                        data["transaction_id"] = values.transactionid;
                        parentProps.processBook(data);
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
            .post(`${SERVER_URL}/book/order/payment`, { amount: amount })
            .then((res) => {
                options.order_id = res.data.id;
                options.amount = res.data.amount;
                console.log("razorpay options => ", options);
                var rzp1 = new window.Razorpay(options);
                rzp1.open();
            })
            .catch((e) => console.log(e));
    }

    render() {
        return (
            <button
                className="btn btn-warning btn-large mt-3"
                style={{ width: "250px", height: "48px" }}
                onClick={() => {
                    this.openPayModal();
                }}
                value="Continue"
            >
                Continue
            </button>
        );
    }
}

export default PaymentComponent;
