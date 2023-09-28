import Axios from "axios";
import React, { useState } from "react";

import config from "../config";
import { toast } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";

const Share = () => {
    const currentAccessToken = config.AUTH.DRIVER.getItem("access_token");
    const [file, setFile] = useState(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileSelected = e => {
        const fileSelected = e.target.files[0];
        setFile(fileSelected);
    };

    const handleSubmit = async () => {
        if (file === null || code === "") {
            toast("error", "Tất cả thông tin đều là bắt buộc!");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            let config = {
                method: "post",
                maxBodyLength: Infinity,
                // ${env}
                // url: "http://localhost:8080/api/v1/demo/ib",
                url: `${env}/api/v1/demo/ib`,
                headers: {
                    Authorization: `Bearer ${currentAccessToken}`
                },
                data: formData
            };

            Axios.request(config)
                .then(response => {
                    console.log(response.data);
                    if (response.data === "OK") {
                        setLoading(false);
                        toast("success", "Đã chia IB thành công!");
                        setFile(null);
                        setCode("");
                    } else {
                        setLoading(false);
                        toast("error", response.data);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    console.log(">>> error ", error);
                });
        } catch (error) {
            setLoading(false);
            console.error("Lỗi khi gửi tệp lên API: ", error);
        }
    };

    return (
        <AdminLayout>
            <div className="px-4 py-3 bg-white border rounded-md shadow-xs col-span-full">
                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <span>Chọn file excel</span>
                    <input
                        style={{ width: "50%" }}
                        className="select"
                        type="file"
                        onChange={handleFileSelected}
                    />
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <span>2FA</span>
                    <input
                        style={{ width: "50%" }}
                        className="select"
                        type="text"
                        value={code}
                        onChange={e => {
                            setCode(e.target.value);
                        }}
                    />
                </div>

                {loading ? (
                    <div className="col-span-1 mt-3" style={{ width: "100%" }}>
                        <div className="px-2 py-1 font-semibold text-white-300 bg-gray-400 rounded text-center">
                            <button className="place-items-center w-100 text-center">Submit</button>
                        </div>
                    </div>
                ) : (
                    <div className="col-span-1 mt-3" style={{ width: "100%" }}>
                        <div className="px-2 py-1 font-semibold text-black-300 bg-emerald-400 rounded text-center">
                            <button
                                className="place-items-center w-100 text-center"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Share;
