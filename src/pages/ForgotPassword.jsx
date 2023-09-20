import Axios from "axios";
import React, { useState } from "react";

import { PrimaryButton } from "../components/buttons";
import { Input } from "../components/field";
import { Link, Loader } from "../components/utils";
import { toast } from "../helpers";
import env from "../helpers/env";
import AuthLayout from "../layouts/AuthLayout";

const ForgotPassword = () => {
    const [validationMessage] = useState([]);
    const [email, setEmail] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    let regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleGetCode = () => {
        let data = JSON.stringify({
            email: email
        });

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${env}/api/v1/auth/getCode`,
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        };

        Axios.request(config)
            .then(response => {
                if (response.data === "OK") {
                    toast(
                        "success",
                        "Mã xác nhận đã được gửi về email, xin vui lòng kiểm tra email!"
                    );
                } else if (response.data === "Email không tồn tại!") {
                    toast("error", "Địa chỉ email không tồn tại!");
                }
            })
            .catch(error => {
                console.log("error ", error);
            });
    };

    const onSubmit = () => {
        setLoading(true);
        //setValidationMessage([]);
        if (email === "" || newPass === "" || confirmPass === "" || code === "") {
            toast("error", "Các thông tin bắt buộc để khôi phục mật khẩu!");
            //setValidationMessage(["Các thông tin bắt buộc để khôi phục mật khẩu!"]);
            return;
        } else if (!regex.test(email)) {
            toast("error", "Địa chỉ email không hợp lệ!");
            //setValidationMessage(["Địa chỉ email không hợp lệ!"]);
            return;
        } else if (newPass !== confirmPass) {
            toast("error", "Mật khẩu mới và xác nhận mật khẩu không trùng khớp!!");
            //setValidationMessage(["Mật khẩu mới và xác nhận mật khẩu không trùng khớp!"]);
            return;
        }
        setTimeout(() => {
            setLoading(false);
            let data = JSON.stringify({
                email: email,
                newPass: newPass,
                code: code
            });

            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${env}/api/v1/auth/forgot-password`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: data
            };

            Axios.request(config)
                .then(response => {
                    console.log(response.data);
                    if (response.data === "Email không tồn tại!") {
                        toast("error", "Địa chỉ email không tồn tại!");
                    } else if (response.data === "Yêu cầu khôi phục không tồn tại!") {
                        toast("error", "Yêu cầu khôi phục không tồn tại!");
                    } else if (response.data === "Mã xác thực không chính xác!") {
                        toast("error", "Mã xác thực không chính xác!");
                    } else if (response.data === "OK") {
                        toast("success", "Mật khẩu đã được cập nhật!");
                        setEmail("");
                        setNewPass("");
                        setConfirmPass("");
                        setCode("");
                        //setValidationMessage([]);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }, 300);
    };

    return (
        <AuthLayout
            title={
                <>
                    Welcome to <br /> our community
                </>
            }
        >
            <h3 className="text-center text-xl font-semibold text-gray-700">Reset password</h3>
            <p className="text-center text-sm mt-2 mb-10">
                If you forgot your password, don't worry! we’ll email you <br /> instructions to
                reset your password.
            </p>

            <form className="space-y-5">
                <div>
                    <Input
                        label={"Email"}
                        id="email"
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                        error={validationMessage}
                    />
                    <p
                        onClick={handleGetCode}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Button
                    </p>
                </div>

                <div>
                    <Input
                        label={"Mật khẩu mới"}
                        id="newPass"
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPass}
                        onChange={e => {
                            setNewPass(e.target.value);
                        }}
                        error={validationMessage}
                    />
                </div>

                <div>
                    <Input
                        label={"Xác nhận mật khẩu"}
                        id="confirmPass"
                        type="password"
                        placeholder="Nhập xác mật khẩu mới"
                        value={confirmPass}
                        onChange={e => {
                            setConfirmPass(e.target.value);
                        }}
                        error={validationMessage}
                    />
                </div>

                <div>
                    <Input
                        label={"Mã xác thực"}
                        id="twoFA"
                        type="text"
                        placeholder="Nhập mã xác thực"
                        value={code}
                        onChange={e => {
                            setCode(e.target.value);
                        }}
                        error={validationMessage}
                    />
                </div>

                <PrimaryButton onClick={onSubmit} disabled={loading}>
                    {loading && <Loader color={"white"} />}
                    <span>Submit</span>
                </PrimaryButton>

                <p className="text-sm text-center">
                    <Link href="/login">Back to Login</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
