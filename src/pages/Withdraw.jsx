import Axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";

import Datatable from "../components/datatables/Datatable";
import config from "../config";
import { formatToCurrency } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";
import "../assets/ProgressBar.css";

const Withdraw = () => {
    const [bank, setBank] = useState("");
    const [account, setAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [code, setCode] = useState("");
    const currentEmail = config.AUTH.DRIVER.getItem("email");
    const currentAccessToken = config.AUTH.DRIVER.getItem("access_token");
    const [balance, setBalance] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let configGetBalance = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${env}/api/v1/demo/getBalance/${currentEmail}`,
            headers: {
                Authorization: `Bearer ${currentAccessToken}`
            }
        };

        Axios.request(configGetBalance).then(response => {
            setBalance(response.data);
        });
    }, [currentEmail, currentAccessToken]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let config = {
                method: "get",
                maxBodyLength: Infinity,
                url: `${env}/api/v1/demo/getTransaction/${currentEmail}`,
                headers: { Authorization: `Bearer ${currentAccessToken}` }
            };

            const fetchData = async () => {
                const response = await Axios.request(config);
                setData(
                    response.data.map(item => {
                        return {
                            transaction: {
                                text: item.id,
                                jsx: (
                                    <div className="text-lg text-purple-500 cursor-pointer hover:cursor-pointer">
                                        #{item.id}
                                    </div>
                                )
                            },
                            time: {
                                text: item.time,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">
                                            {moment.unix(item.time).format("HH:mm:ss DD/MM/YYYY")}
                                        </span>
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
                                        {item.status === 0
                                            ? "Pending"
                                            : item.status === 1
                                            ? "Thành công"
                                            : "Huỷ"}
                                    </div>
                                )
                            },
                            code: {
                                text: item.transaction,
                                jsx: <span className="font-light">{item.transaction}</span>
                            }
                        };
                    })
                );
            };

            fetchData();

            setLoading(false);
        }, 500);
    }, [currentEmail, currentAccessToken]);

    const handleSubmit = () => {
        if (bank === "" || account === "" || amount === "" || code === "") {
            alert("Required input");
            return;
        } else if (parseFloat(amount) < 0) {
            alert("Input must be greater than 0");
            return;
        } else if (isNaN(amount)) {
            alert("Input must be a number");
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
                    let data = JSON.stringify({
                        email: currentEmail,
                        amount: amount,
                        code: code
                    });

                    let config = {
                        method: "post",
                        maxBodyLength: Infinity,
                        url: `${env}/api/v1/demo/withdraw-ib`,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${currentAccessToken}`
                        },
                        data: data
                    };

                    Axios.request(config)
                        .then(response => {
                            console.log(response.data);

                            if (response.data === "Rút thành công!") {
                                window.Swal.fire(
                                    "Confirmed!",
                                    "Your transaction has been created.",
                                    "success"
                                ).then(() => {
                                    window.location.reload();
                                });
                            } else if (response.data === "Mã 2FA không chính xác!") {
                                window.Swal.fire("Confirmed!", "Your 2FA is not valid.", "error");
                            } else if (
                                response.data ===
                                "Không đủ số dư để rút, luôn phải chừa lại 1 cent ~ $0.1"
                            ) {
                                window.Swal.fire(
                                    "Confirmed!",
                                    "Không đủ số dư để rút, luôn phải chừa lại 1 cent ~ $0.1",
                                    "error"
                                );
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
        }
    };
    return (
        <AdminLayout>
            <div className="px-4 py-3 bg-white border rounded-md shadow-xs col-span-full">
                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex text-2xl font-light text-orange-500 transition-all duration-300 w-3/4">
                        Ngân hàng
                    </p>
                    <input
                        className="select w-3/4"
                        type="text"
                        value={bank}
                        placeholder="Nhập tên ngân hàng"
                        onChange={e => {
                            setBank(e.target.value);
                        }}
                    />
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex w-3/4 text-2xl font-light text-orange-500 transition-all duration-300">
                        Số tài khoản
                    </p>
                    <input
                        className="select w-3/4"
                        type="text"
                        value={account}
                        placeholder="Nhập số tài khoản"
                        onChange={e => {
                            setAccount(e.target.value);
                        }}
                    />
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex w-3/4 text-2xl font-light text-orange-500 transition-all duration-300">
                        Số tiền
                    </p>
                    <input
                        type="number"
                        className="select w-3/4"
                        value={amount}
                        min="0"
                        placeholder="Nhập số tiền"
                        onChange={e => {
                            setAmount(e.target.value);
                        }}
                    />
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex w-3/4 text-2xl font-light text-orange-500 transition-all duration-300">
                        2FA
                    </p>
                    <input
                        type="number"
                        className="select w-3/4"
                        value={code}
                        min="0"
                        placeholder="Nhập mã 2FA"
                        onChange={e => {
                            setCode(e.target.value);
                        }}
                    />
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex text-2xl font-light text-orange-500 transition-all duration-300">
                        Balance
                    </p>
                    <p className="flex text-2xl font-light text-orange-500 transition-all duration-300">
                        {formatToCurrency(balance)}
                    </p>
                </div>

                {/* <div className="flex justify-center col-span-6 mt-3 min-w-min">
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
                </div> */}

                <div className="flex justify-center col-span-1 mt-3">
                    <div className="px-2 py-1 font-semibold text-black-300 bg-emerald-400 rounded">
                        <button className="place-items-center" onClick={handleSubmit}>
                            Withdraw
                        </button>
                    </div>
                </div>
            </div>

            <div className="">
                <Datatable
                    head={["Tracsaction", "Time", "Amount", "Status", "Transaction Code"]}
                    dataProperty={["transaction", "time", "amount", "status", "code"]}
                    list={data}
                    loading={loading}
                />
            </div>
        </AdminLayout>
    );
};

export default Withdraw;
