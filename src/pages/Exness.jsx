import Axios from "axios";
import React, { useState, useEffect } from "react";

import Datatable from "../components/datatables/Datatable";
import config from "../config";
import { toast } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";
import "../assets/ProgressBar.css";

const Exness = () => {
    const [exnessId, setExnessId] = useState("");
    const [code, setCode] = useState("");
    const currentEmail = config.AUTH.DRIVER.getItem("email");
    const currentAccessToken = config.AUTH.DRIVER.getItem("access_token");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let config = {
                method: "get",
                maxBodyLength: Infinity,
                url: `${env}/api/v1/demo/get-exness/${currentEmail}`,
                headers: {
                    Authorization: `Bearer ${currentAccessToken}`
                }
            };

            const fetchData = async () => {
                const response = await Axios.request(config);
                setData(
                    response.data.map(item => {
                        return {
                            exnessid: {
                                text: item.exnessId,
                                jsx: (
                                    <div className="text-lg text-purple-500 cursor-pointer hover:cursor-pointer">
                                        {item.exnessId}
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
    }, [currentEmail, currentAccessToken]);

    const handleSubmit = () => {
        if (exnessId === "") {
            toast("error", "Thông tin bắt buộc!");
            return;
        }
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
                    exness: exnessId,
                    type: 1
                });

                let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `${env}/api/v1/demo/update-exness`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentAccessToken}`
                    },
                    data: data
                };

                Axios.request(config)
                    .then(response => {
                        console.log(response.data);
                        if (response.data.message === "Exness ID này đã tồn tại.") {
                            toast("error", "ID Exness này đã được liên kết với tài khoản khác!");
                        } else {
                            window.Swal.fire(
                                "Confirmed!",
                                "Liên kết ID Exness thành công!",
                                "success"
                            ).then(() => {
                                window.location.reload();
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    };
    return (
        <AdminLayout>
            <div className="px-4 py-3 bg-white border rounded-md shadow-xs col-span-full">
                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <p className="flex text-2xl font-light text-orange-500 transition-all duration-300 w-3/4">
                        Exness ID
                    </p>
                    <input
                        className="select w-3/4"
                        type="text"
                        value={exnessId}
                        placeholder="Nhập ID Exness"
                        onChange={e => {
                            setExnessId(e.target.value);
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

                <div className="flex justify-center col-span-1 mt-3">
                    <div className="px-2 py-1 font-semibold text-black-300 bg-emerald-400 rounded">
                        <button className="place-items-center" onClick={handleSubmit}>
                            Thêm Exness ID
                        </button>
                    </div>
                </div>
            </div>

            <div className="">
                <Datatable
                    head={["Exness Id"]}
                    dataProperty={["exnessid"]}
                    list={data}
                    loading={loading}
                />
            </div>
        </AdminLayout>
    );
};

export default Exness;
