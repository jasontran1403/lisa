import Axios from "axios";
import qs from "qs";
import React, { useState, useEffect } from "react";

import Datatable from "../components/datatables/Datatable";
import config from "../config";
import { formatToCurrency, toast } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";

const Invest = () => {
    const currentUsername = config.AUTH.DRIVER.getItem("username");
    const [packs, setPacks] = useState([]);
    const [price, setPrice] = useState(0);
    const [profit, setProfit] = useState("0");
    const [time, setTime] = useState("0 days");
    const [cashBalance, setCashBalance] = useState(0);
    const [info, setInfo] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let config = {
            method: "get",
            url: `${env}/api/packages`
        };

        Axios(config).then(response => {
            setPacks(response.data);
        });
    }, [currentUsername]);

    useEffect(() => {
        let configCashBalance = {
            method: "get",
            url: `${env}/api/cashWallet/balance/${currentUsername}`
        };

        Axios(configCashBalance).then(response => {
            setCashBalance(response.data.balance);
        });
    }, [currentUsername]);

    const handlePackageChoose = id => {
        if (id === "default") {
            setPrice(0);
            setProfit(0);
            setTime("0 days");
            setInfo({ packid: null, username: currentUsername });
            return;
        }
        setPrice(packs[id - 1].price);
        setProfit(packs[id - 1].daily.toFixed(3));
        setTime("300 days");
        setInfo({ packid: id, username: currentUsername });
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let configCommissionHistory = {
                method: "get",
                url: `${env}/api/history/investment/${currentUsername}`
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
                            time: {
                                text: item.time,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">{item.time}</span>
                                    </div>
                                )
                            },
                            investmentcode: {
                                text: item.code,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">{item.code}</span>
                                    </div>
                                )
                            },
                            price: {
                                text: item.capital,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">
                                            {formatToCurrency(item.capital)}
                                        </span>
                                    </div>
                                )
                            },
                            count: {
                                text: item.count,
                                jsx: <span className="font-light">{item.count}/300</span>
                            },
                            remain: {
                                text: item.remain,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">
                                            {formatToCurrency(item.remain)}
                                        </span>
                                    </div>
                                )
                            },
                            status: {
                                text: item.count,
                                jsx: (
                                    <div
                                        className={`outline-offset-4 inline-block font-bold px-2 py-1 text-xs font-light text-${
                                            item.count < 300 ? "green" : "red"
                                        }-500 bg-${item.count < 300 ? "green" : "red"}-100 rounded`}
                                    >
                                        {item.count < 300 ? "running" : "end"}
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
        if (info.packid == null) {
            toast("error", "You didnt choose any package");
            return;
        }

        let data = qs.stringify({
            packid: info.packid,
            username: info.username
        });
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${env}/api/package/buy`,
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
                    if (response.data === "Failed, balance is not enough to buy this package") {
                        toast("error", "Balance is not enought to buy this package");
                    } else {
                        toast("success", "Buy package successful");
                    }
                });
            }
        });
    };

    return (
        <AdminLayout>
            <div className="col-span-5 w-full px-4 py-3 bg-white border rounded-md shadow-xs lg:col-span-3 md:col-span-6 text-center">
                <div className="col-span-1 md:col-span-3 lg:col-span-2 px-4 py-3 bg-white border rounded-md shadow-xs text-center">
                    <div className="flex justify-between mt-3">
                        <p className="text-2xl font-light text-orange-500 transition-all duration-300">
                            Package name:
                        </p>
                        <select
                            className="select rounded ml-2"
                            name="packages"
                            onChange={e => {
                                handlePackageChoose(e.target.value);
                            }}
                        >
                            <option value="default" defaultValue>
                                Vui lòng chọn gói
                            </option>
                            {packs.map((pack, index) => {
                                return (
                                    <option key={index} value={pack.id}>
                                        {pack.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="flex justify-between mt-3">
                        <p className="text-2xl font-light text-orange-500 transition-all duration-300">
                            Giá
                        </p>
                        <p className="text-2xl font-light text-orange-500 transition-all duration-300">
                            {formatToCurrency(price)}
                        </p>
                    </div>

                    <div className="flex justify-between mt-3">
                        <p className="text-2xl font-light text-orange-500 transition-all duration-300">
                            Thời gian
                        </p>
                        <p className="text-2xl font-light text-orange-500 transition-all duration-300">
                            {time}
                        </p>
                    </div>

                    <div className="flex justify-between mt-3">
                        <p className="text-2xl font-light text-orange-500 transition-all duration-300">
                            Lãi hàng ngày
                        </p>
                        <p className="text-2xl font-light text-orange-500 transition-all duration-300">
                            {profit}%
                        </p>
                    </div>

                    <div className="flex justify-between mt-3">
                        <p className="text-2xl font-light text-orange-500 transition-all duration-300">
                            Balance
                        </p>
                        <p className="text-2xl font-light text-orange-500 transition-all duration-300">
                            {formatToCurrency(cashBalance)}
                        </p>
                    </div>

                    <div className="flex justify-center mt-3">
                        <div className="px-2 py-1 font-semibold text-black-300 bg-emerald-400 rounded">
                            <button className="place-items-center" onClick={handleSubmit}>
                                Buy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <Datatable
                    head={["Code", "Time", "Investment Code", "Price", "Count", "Remain", "Status"]}
                    dataProperty={[
                        "code",
                        "time",
                        "investmentcode",
                        "price",
                        "count",
                        "remain",
                        "status"
                    ]}
                    list={data}
                    loading={loading}
                />
            </div>
        </AdminLayout>
    );
};

export default Invest;
