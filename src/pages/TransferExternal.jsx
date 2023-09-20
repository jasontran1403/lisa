import Axios from "axios";
import qs from "qs";
import React, { useState } from "react";

import config from "../config";
import { toast } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";
import "../assets/TreeView.css";

const TransferExternal = () => {
    const currentUsername = config.AUTH.DRIVER.getItem("username");
    const [amount, setAmount] = useState(0);

    const handleFetchData = () => {
        if (amount <= 0) {
            toast("error", "Amount must be greater than 0");
            return;
        } else {
            window.Swal.fire({
                title: "Are you sure?",
                text: "You wont be able to revert this transaction!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            }).then(result => {
                if (result.isConfirmed) {
                    let data = qs.stringify({
                        username: currentUsername,
                        amount: amount
                    });
                    let config = {
                        method: "post",
                        url: `${env}/api/user/getPoint`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: data
                    };

                    Axios(config).then(response => {
                        if (response.data) {
                            toast("success", "Get point successful");
                        }
                    });
                }
            });
        }
    };

    return (
        <AdminLayout>
            <div className="px-4 py-3 bg-white border rounded-md shadow-xs col-span-full">
                <div className="flex justify-center col-span-6 mt-3 min-w-min">
                    <p className="flex text-2xl font-light text-orange-500 transition-all duration-300">
                        Amount
                        <input
                            type="number"
                            value={amount}
                            min={0}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </p>
                </div>

                <div className="flex justify-center col-span-1 mt-3">
                    <div className="px-2 py-1 font-semibold text-black-300 bg-emerald-400 rounded">
                        <button onClick={handleFetchData}>Get Point</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TransferExternal;
