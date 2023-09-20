import Axios from "axios";
import qs from "qs";
import React, { useState, useEffect } from "react";

import Datatable from "../components/datatables/Datatable";
import config from "../config";
import { formatToCurrency, toast } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";
import "../assets/ProgressBar.css";

const Swap = () => {
    const [amount, setAmount] = useState("");
    const currentUsername = config.AUTH.DRIVER.getItem("username");
    const [maxOutLeft, setMaxOutLeft] = useState(0);
    const [progress, setProgress] = useState("0%");
    const [cashBalance, setCashBalance] = useState("");
    const [commissionBalance, setCommissionBalance] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let config = {
            method: "get",
            url: `${env}/api/user/${currentUsername}`
        };

        Axios(config).then(response => {
            setCashBalance(response.data.cashbalance);
            setCommissionBalance(response.data.commissionbalance);
            setMaxOutLeft(response.data.user.maxoutleft);
            setProgress(
                `${Math.floor(
                    ((response.data.user.maxout - response.data.user.maxoutleft) /
                        response.data.user.maxout) *
                        100
                )}%`
            );
        });
    }, [currentUsername]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let configCommissionHistory = {
                method: "get",
                url: `${env}/api/history/swap/${currentUsername}`
            };

            const fetchData = async () => {
                const response = await Axios(configCommissionHistory);
                setData(
                    response.data.map(item => {
                        return {
                            id: item.code,
                            code: {
                                text: item.code,
                                jsx: (
                                    <div className="text-lg text-purple-500 cursor-pointer hover:cursor-pointer">
                                        {item.code}
                                    </div>
                                )
                            },
                            date: {
                                text: item.time,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">{item.time}</span>
                                    </div>
                                )
                            },
                            amount: {
                                text: item.amount,
                                jsx: (
                                    <span className="font-light">
                                        {formatToCurrency(item.amount)}
                                    </span>
                                )
                            },
                            type: {
                                text: item.type,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">{item.type}</span>
                                    </div>
                                )
                            },
                            status: {
                                text: item.status,
                                jsx: (
                                    <div
                                        className={`outline-offset-4 inline-block font-bold px-2 py-1 text-xs font-light text-${
                                            item.status === "success" ? "green" : "yellow"
                                        }-500 bg-${
                                            item.status === "success" ? "green" : "yellow"
                                        }-100 rounded`}
                                    >
                                        {item.status}
                                    </div>
                                )
                            }
                        };
                    })
                );
            };

            fetchData();

            setLoading(false);
        }, 500);
    }, [currentUsername]);

    const handleSubmit = () => {
        if (amount === "") {
            alert("Required input");
            return;
        } else if (parseFloat(amount) <= 0) {
            alert("Input must be greater than 0");
            return;
        } else {
            let data = qs.stringify({
                username: currentUsername,
                amount: amount
            });
            let config = {
                method: "post",
                url: `${env}/api/wallet/swap`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: data
            };

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
                    Axios(config).then(response => {
                        if (response.data === "success") {
                            toast("success", "Swap successful");
                        } else {
                            toast("error", response.data);
                        }
                    });
                }
            });
        }
    };
    return (
        <AdminLayout>
            <div className="px-4 py-3 bg-white border rounded-md shadow-xs col-span-full">
                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex w-3/4 text-2xl font-light text-orange-500 transition-all duration-300">
                        Amount
                    </p>
                    <input
                        type="number"
                        className="select w-3/4"
                        value={amount}
                        min="0"
                        placeholder="Amount"
                        onChange={e => {
                            setAmount(e.target.value);
                        }}
                    />
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex text-2xl font-light text-orange-500 transition-all duration-300">
                        Balance
                    </p>
                    <p className="flex text-2xl font-light text-orange-500 transition-all duration-300">
                        {formatToCurrency(cashBalance)}
                    </p>
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex text-2xl font-light text-orange-500 transition-all duration-300">
                        Commission
                    </p>
                    <p className="flex text-2xl font-light text-orange-500 transition-all duration-300">
                        {formatToCurrency(commissionBalance)}
                    </p>
                </div>

                <div className="flex justify-center col-span-6 mt-3 min-w-min">
                    <div className="loading-bar bg-white border rounded-md w-full">
                        <div
                            className="progress-bar"
                            style={{
                                width: progress,
                                height: "100%",
                                background: "rgb(255 58 58)",
                                borderRadius: "5px",
                                border: "0 solid #0abde3"
                            }}
                        >
                            <div className="progress-bar-content font-semibold">
                                {formatToCurrency(maxOutLeft)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center col-span-1 mt-3">
                    <div className="px-2 py-1 font-semibold text-black-300 bg-emerald-400 rounded">
                        <button className="place-items-center" onClick={handleSubmit}>
                            Swap
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <Datatable
                    head={["Code", "Time", "Amount", "Type", "Status"]}
                    dataProperty={["code", "date", "amount", "type", "status"]}
                    list={data}
                    loading={loading}
                />
            </div>
        </AdminLayout>
    );
};

export default Swap;
