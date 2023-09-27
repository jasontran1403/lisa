import Axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "../components/buttons";
import { Input } from "../components/field";
import { Link, Loader } from "../components/utils";
import { toast } from "../helpers";
import env from "../helpers/env";
import AuthLayout from "../layouts/AuthLayout";

const Register = () => {
    const navigate = useNavigate();

    const defaultMessage = {
        firstname: [],
        lastname: [],
        email: [],
        password: [],
        refferal: [],
        code: []
    };

    const [loading, setLoading] = useState(false);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [refferal, setRefferal] = useState("");
    const [code, setCode] = useState("");
    const [balance] = useState(0);
    const [errorMessage, setErrorMessage] = useState(defaultMessage);

    let regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let dataforRegis = JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        refferal: refferal,
        code: code,
        balance: balance
    });

    let configRegis = {
        method: "post",
        url: `${env}/api/v1/auth/register`,
        headers: {
            "Content-Type": "application/json"
        },
        data: dataforRegis
    };

    const register = () => {
        setLoading(true);
        setTimeout(() => {
            const newErrorMessage = defaultMessage;
            if (email === "") {
                newErrorMessage.email = ["This field is required"];
            }
            if (password === "") {
                newErrorMessage.password = ["This field is required"];
            }
            if (firstname === "") {
                newErrorMessage.fullname = ["This field is required"];
            }
            if (lastname === "") {
                newErrorMessage.username = ["This field is required"];
            }
            if (refferal === "") {
                newErrorMessage.refferal = ["This field is required"];
            }
            if (code === "") {
                newErrorMessage.code = ["This field is required"];
            }
            if (!regEmail.test(email)) {
                newErrorMessage.email = ["Invalid email pattern"];
            }

            if (
                email &&
                firstname &&
                lastname &&
                password &&
                refferal &&
                code &&
                regEmail.test(email)
            ) {
                Axios.request(configRegis)
                    .then(response => {
                        if (response.status === 200) {
                            toast("success", "Successful registration");
                            navigate("/login");
                        } else if (response.status === 226) {
                            if (response.data.message === "Mã giới thiệu này đã tồn tại!") {
                                toast("error", `Mã giới thiệu ${code} đã tồn tại!`);
                            } else {
                                toast("error", `Địa chỉ email ${email} đã tồn tại!`);
                            }
                        }
                    })
                    .catch(error => {
                        if (error.response) {
                            toast("error", error.response.data.message);
                        } else {
                            toast("error", "Lỗi hệ thống, vui lòng thử lại sau!");
                        }
                    });
            } else {
                setErrorMessage(defaultMessage);
            }
            setLoading(false);
        }, 500);
    };

    return (
        <AuthLayout>
            <h3 className="text-center text-xl font-semibold text-gray-700">Create New Account</h3>

            <form className="space-y-5">
                <div>
                    <Input
                        label={"Tên"}
                        id="firstname"
                        type="text"
                        placeholder="Điền tên"
                        value={firstname}
                        onChange={e => setFirstname(e.target.value)}
                        error={errorMessage.firstname}
                    />
                </div>

                <div>
                    <Input
                        label={"Họ"}
                        id="lastname"
                        type="text"
                        placeholder="Điền họ (và tên đệm)"
                        value={lastname}
                        onChange={e => setLastname(e.target.value)}
                        error={errorMessage.lastname}
                    />
                </div>

                <div>
                    <Input
                        label={"Địa chỉ Email"}
                        id="email"
                        type="email"
                        placeholder="Điền địa chỉ email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        error={errorMessage.email}
                    />
                </div>

                <div>
                    <Input
                        label={"Mật khẩu"}
                        id="password"
                        type="password"
                        placeholder="Điền mật khẩu"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={errorMessage.password}
                    />
                </div>

                <div>
                    <Input
                        label={"Mã giới thiệu của bạn"}
                        id="code"
                        type="text"
                        placeholder="Điền mã giới thiệu của bạn"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        error={errorMessage.code}
                    />
                </div>

                <div>
                    <Input
                        label={"Mã của người giới thiệu"}
                        id="refferal"
                        type="text"
                        placeholder="Điền mã của người giới thiệu"
                        value={refferal}
                        onChange={e => setRefferal(e.target.value)}
                        error={errorMessage.refferal}
                    />
                </div>

                <PrimaryButton onClick={register}>
                    {loading && <Loader color={"white"} />}
                    <span>Sign up</span>
                </PrimaryButton>

                <p className="text-sm text-center">
                    Already have an account? <Link href="/login">Login</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;
