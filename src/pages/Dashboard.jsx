import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";

import Datatable from "../components/datatables/Datatable";
import config from "../config";
import { formatToCurrency } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";
import "../assets/Loading.css";

const ReloadAccount = () => {
    const currentEmail = config.AUTH.DRIVER.getItem("email");
    const currentToken = config.AUTH.DRIVER.getItem("access_token");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let config = {
                method: "get",
                maxBodyLength: Infinity,
                url: `${env}/api/v1/demo/getHistory/${currentEmail}`,
                headers: { Authorization: `Bearer ${currentToken}` }
            };

            const fetchData = async () => {
                const response = await Axios.request(config);
                setData(
                    response.data.map(item => {
                        return {
                            transaction_code: {
                                text: item.transaction,
                                jsx: (
                                    <div className="text-lg text-purple-500 cursor-pointer hover:cursor-pointer">
                                        #{item.transaction}
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
                            from: {
                                text: item.sender,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">{item.sender}</span>
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
                            message: {
                                text: item.message,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">{item.message}</span>
                                    </div>
                                )
                            }
                            // ,
                            // status: {
                            //     text: item.status,
                            //     jsx: (
                            //         <div
                            //             className={`outline-offset-4 inline-block font-bold px-2 py-1 text-xs font-light text-${item.status === "success" ? "green" : "yellow"
                            //                 }-500 bg-${item.status === "success" ? "green" : "yellow"
                            //                 }-100 rounded`}
                            //         >
                            //             {item.status}
                            //         </div>
                            //     )
                            // }
                        };
                    })
                );
            };

            fetchData();

            setLoading(false);
        }, 500);
    }, [currentEmail, currentToken]);

    return (
        <AdminLayout>
            <div className="grid grid-cols-1">
                <Datatable
                    head={["Transaction Code", "Time", "From", "Amount", "Message"]}
                    dataProperty={["transaction_code", "time", "from", "amount", "message"]}
                    list={data}
                    loading={loading}
                />
            </div>
        </AdminLayout>
    );
};

export default ReloadAccount;
