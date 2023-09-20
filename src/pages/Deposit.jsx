import Axios from "axios";
import React, { useState, useEffect } from "react";

import Datatable from "../components/datatables/Datatable";
import config from "../config";
import { formatToCurrency } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";
import "../assets/ProgressBar.css";

const Deposit = () => {
    const [amount, setAmount] = useState("");
    const currentUsername = config.AUTH.DRIVER.getItem("username");
    const [maxOutLeft, setMaxOutLeft] = useState(0);
    const [progress, setProgress] = useState("0%");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let config = {
            method: "get",
            url: `${env}/api/user/${currentUsername}`
        };

        Axios(config).then(response => {
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
                url: `${env}/api/history/deposit/${currentUsername}`
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
                                            item.status === "success"
                                                ? "green"
                                                : item.status === "pending"
                                                ? "yellow"
                                                : "red"
                                        }-500 bg-${
                                            item.status === "success"
                                                ? "green"
                                                : item.status === "pending"
                                                ? "yellow"
                                                : "red"
                                        }-100 rounded`}
                                    >
                                        {item.status}
                                        {item.status === "pending" ? (
                                            <button> (Cancel)</button>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                )
                            },
                            hash: {
                                text: item.hash,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">{item.hash}</span>
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
                    console.log({ amount });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            });
        }
    };

    return (
        <AdminLayout>
            <div className="px-4 py-3 bg-white border rounded-md shadow-xs">
                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex w-3/4 text-2xl font-light text-orange-500 transition-all duration-300">
                        Network
                    </p>
                    <select className="select w-3/4">
                        <option>Vui lòng chọn mạng</option>
                    </select>
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex w-3/4 text-2xl font-light text-orange-500 transition-all duration-300">
                        Currency
                    </p>
                    <select className="select w-3/4">
                        <option>Vui lòng chọn loại tiền</option>
                    </select>
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex w-3/4 text-2xl font-light text-orange-500 transition-all duration-300">
                        Số lượng
                    </p>
                    <input
                        className="select w-3/4"
                        type="number"
                        min="0"
                        onChange={e => {
                            setAmount(e.target.value);
                        }}
                    />
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
                            Deposit
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <Datatable
                    head={["Code", "Time", "Amount", "Type", "Status", "Hash"]}
                    dataProperty={["code", "date", "amount", "type", "status", "hash"]}
                    list={data}
                    loading={loading}
                />
            </div>
        </AdminLayout>
    );
};

export default Deposit;
