import Axios from "axios";
import React, { useState } from "react";

import config from "../config";
import { toast } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";

const Profile = () => {
    const currentEmail = config.AUTH.DRIVER.getItem("email");
    const currentAccessToken = config.AUTH.DRIVER.getItem("access_token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [authen, setAuthen] = useState("");

    const handleSubmit = () => {
        if (newPassword === "" || confirmPassword === "" || authen === "") {
            toast("error", "Tất cả thông tin đều là bắt buộc!");
            return;
        } else if (newPassword !== confirmPassword) {
            toast("error", "Mật khẩu mới và xác nhận mật khẩu không trùng khớp!");
            return;
        } else {
            let data = JSON.stringify({
                email: currentEmail,
                password: newPassword,
                code: authen
            });

            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${env}/api/v1/demo/change-password`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentAccessToken}`
                },
                data: data
            };

            window.Swal.fire({
                title: "Are you sure?",
                text: "You wont be able to revert this action!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            }).then(result => {
                if (result.isConfirmed) {
                    Axios(config).then(response => {
                        if (response.data === "Thay đổi mật khẩu thành công!") {
                            toast("success", "Thay đổi mật khẩu thành công!");
                            window.location.reload();
                        } else if (response.data === "Mã 2FA không chính xác!") {
                            toast("error", "Mã 2FA không chính xác!");
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
                    <span>New pass</span>
                    <input
                        style={{ width: "50%" }}
                        className="select"
                        type="password"
                        value={newPassword}
                        onChange={e => {
                            setNewPassword(e.target.value);
                        }}
                    />
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <span>Confirm pass</span>
                    <input
                        style={{ width: "50%" }}
                        className="select"
                        type="password"
                        value={confirmPassword}
                        onChange={e => {
                            setConfirmPassword(e.target.value);
                        }}
                    />
                </div>

                <div className="flex justify-between col-span-6 mt-3 min-w-min">
                    <span>2FA</span>
                    <input
                        style={{ width: "50%" }}
                        className="select"
                        type="text"
                        value={authen}
                        onChange={e => {
                            setAuthen(e.target.value);
                        }}
                    />
                </div>

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
            </div>
        </AdminLayout>
    );
};

export default Profile;
