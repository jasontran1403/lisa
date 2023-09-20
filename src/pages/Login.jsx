import Axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "../components/buttons";
import { Checkbox, Input } from "../components/field";
import { Link, Loader } from "../components/utils";
import config from "../config";
import { toast } from "../helpers";
import env from "../helpers/env";
import AuthLayout from "../layouts/AuthLayout";

const Login = () => {
    const navigate = useNavigate();
    const defaultMessage = {
        email: [],
        password: []
    };

    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState(defaultMessage);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const login = () => {
        setLoading(true);
        setTimeout(() => {
            const newErrorMessage = defaultMessage;
            if (!email) {
                newErrorMessage.email = ["This field is required"];
            }
            if (!password) {
                newErrorMessage.password = ["This field is required"];
            }

            let dataLogin = JSON.stringify({
                email: email,
                password: password
            });

            let configLogin = {
                method: "post",
                url: `${env}/api/v1/auth/authenticate`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: dataLogin
            };

            let dataValid = JSON.stringify({
                email: email,
                password: password,
                code: code
            });

            let configValid = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${env}/api/v1/auth/validation`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: dataValid
            };

            Axios(configValid).then(response => {
                if (response.data === "Not Actived") {
                    toast("error", "This account has not been activated, please try again");
                } else if (response.data === "Wrong 2FA") {
                    toast("error", "Wrong 2FA, please try again");
                } else if (
                    response.data === "Username is not exist" ||
                    response.data === "Password is not correct"
                ) {
                    toast("error", "Your acount is invalid, please try again");
                } else {
                    Axios(configLogin).then(response => {
                        setInvalid(true);
                        config.AUTH.DRIVER.setItem("user", {
                            permissions: ["dashboard"]
                        });
                        config.AUTH.DRIVER.setItem("email", email);
                        config.AUTH.DRIVER.setItem("access_token", response.data.access_token);
                        config.AUTH.DRIVER.setItem("refresh_token", response.data.refresh_token);
                        toast("success", "Login successfull!");
                        navigate(config.AUTH.REDIRECT_LOGIN);
                    });
                }
            });

            setErrorMessage(newErrorMessage);
            setLoading(false);
        }, 1000);
    };

    return (
        <AuthLayout>
            <h3 className="text-center text-xl font-semibold text-gray-700">Login to Account</h3>
            <p className="text-center text-sm mt-2 mb-10">
                Please sign-in to your account and start the adventure.
            </p>

            {invalid && (
                <div className="my-2 text-center text-red-600 bg-red-100 py-2 rounded-md">
                    Invalid username or password
                </div>
            )}

            <form className="space-y-5">
                <div>
                    <Input
                        label={"Email"}
                        id="email"
                        type="text"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        error={errorMessage.email}
                    />
                </div>

                <div>
                    <Input
                        label={"Password"}
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={errorMessage.password}
                    />
                </div>

                <div>
                    <Input
                        label={"Authenticator 2FA"}
                        id="code"
                        type="text"
                        placeholder="2FA Authentication"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        error={errorMessage.code}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Checkbox id="remember" label="Remember Me" />

                    <Link href="/forgot-password">Forgot Password?</Link>
                </div>

                <PrimaryButton onClick={login} disabled={loading}>
                    {loading && <Loader color={"white"} />}
                    <span>Login to account</span>
                </PrimaryButton>

                <p className="text-sm text-center">
                    <Link href="/resend-active">Resend Activation Code</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;
