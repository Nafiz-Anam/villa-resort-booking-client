import React, { Component } from "react";

class Cancellation extends Component {
    render() {
        return (
            <div className="container">
                <h3 className="mt-5">Cancellation Policy</h3>
                <p>
                    This cancellation policy is default for all the properties
                    which do not have its own special cancellation policy.
                    (check individual property page for special cancellation
                    policy)
                </p>
                <p>
                    A) No refund will be provided if the guest cancels the
                    booking within 15 days of the date of check-in (before 12:00
                    PM, IST)
                </p>
                <p>
                    B) 50% of the full amount will be refunded if the guest
                    cancels the booking 15 days before the date of check-in
                    (before 12:00 PM, IST)
                </p>
                <p>
                    C) No refund will be provided if the booking is made with a
                    partial advance payment.
                </p>
                <p>
                    Payment for any other services like food, decoration or
                    special arrangement is non refundable.
                </p>
                <p>
                    Special note: In case of sudden lockdown, curfew, or natural
                    calamities dates can be changed but however refund won’t be
                    provided
                </p>
            </div>
        );
    }
}

export default Cancellation;
