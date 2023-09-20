import Axios from "axios";
import qs from "qs";
import React, { useState } from "react";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PrimaryButton } from "../components/buttons";
import { Input } from "../components/field";
import { Link, Loader } from "../components/utils";
import { toast } from "../helpers";
import env from "../helpers/env";
import AuthLayout from "../layouts/AuthLayout";

const Register = () => {
    const navigate = useNavigate();
    const [alreadyRegis, setAlreadyRegis] = useState(false);
    const { uuid } = useParams();
    const [side, setSide] = useState("");

    var configPlacement = useMemo(
        () =>
            (configPlacement = {
                method: "get",
                url: `${env}/api/affiliate/${uuid}`
            }),
        [uuid]
    );

    useEffect(() => {
        Axios(configPlacement)
            .then(response => {
                setRootUsername(response.data.root);
                setPlacement(response.data.placement);
                setAlreadyRegis(response.data.status);
                setSide(response.data.side);
                if (response.data.status) {
                    toast("error", "This placement has been registered...");
                    navigate("/login");
                }
            })
            .catch(() => {
                toast("error", "This ref link is invalid");
            });
    }, [configPlacement, navigate]);

    const defaultMessage = {
        email: [],
        username: [],
        fullname: [],
        password: [],
        root: [],
        placement: [],
        alreadyRegis: []
    };

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rootUsername, setRootUsername] = useState("");
    const [placement, setPlacement] = useState("");
    const [errorMessage, setErrorMessage] = useState(defaultMessage);

    let regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let dataforRegis = JSON.stringify({
        id: 0,
        name: fullname,
        username: username,
        password: password,
        email: email,
        roles: [],
        rootUsername: rootUsername,
        placement: placement,
        side: side,
        leftref: "",
        rightref: ""
    });

    let configRegis = {
        method: "post",
        url: `${env}/api/user/regis`,
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
            if (fullname === "") {
                newErrorMessage.fullname = ["This field is required"];
            }
            if (username === "") {
                newErrorMessage.username = ["This field is required"];
            }
            if (rootUsername === "") {
                newErrorMessage.rootUsername = ["This field is required"];
            }
            if (placement === "") {
                newErrorMessage.placement = ["This field is required"];
            }

            if (!regEmail.test(email)) {
                newErrorMessage.email = ["Invalid email pattern"];
            }

            if (alreadyRegis) {
                toast("error", "This placement already registered");
            }

            if (
                email &&
                fullname &&
                username &&
                password &&
                rootUsername &&
                placement &&
                alreadyRegis == false
            ) {
                Axios(configRegis)
                    .then(() => {
                        let configRegistered = {
                            method: "put",
                            url: `${env}/api/affiliate/${uuid}`
                        };
                        Axios(configRegistered).catch(error => {
                            console.log(error);
                        });
                        toast("success", "Successful registration");
                        navigate("/login");
                    })
                    .catch(error => {
                        let message_error = error.response.data.message;
                        if (message_error.includes("username")) {
                            toast(
                                "error",
                                "This username already exists, please choose other username"
                            );
                            newErrorMessage.username = ["This username already exists"];
                        } else if (message_error.includes("email")) {
                            toast(
                                "error",
                                "Email address already exists, please enter other email address"
                            );
                            newErrorMessage.email = ["This email address already exists"];
                        }
                    });

                let dataRef = qs.stringify({
                    username: placement,
                    usernameRef: username,
                    side: side
                });
                let configRef = {
                    method: "put",
                    url: `${env}/api/user/updateRef`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: dataRef
                };

                Axios(configRef).then(response => {
                    console.log(response.data);
                });
            } else {
                setErrorMessage(defaultMessage);
                setLoading(false);
            }
        }, 500);
    };

    return (
        <AuthLayout>
            <h3 className="text-center text-xl font-semibold text-gray-700">Create New Account</h3>

            <form className="space-y-5">
                <div>
                    <Input
                        label={"Username"}
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        error={errorMessage.username}
                    />
                </div>

                <div>
                    <Input
                        label={"Fullname"}
                        id="fullname"
                        type="text"
                        placeholder="Enter fullname"
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
                        error={errorMessage.fullname}
                    />
                </div>

                <div>
                    <Input
                        label={"Email"}
                        id="email"
                        type="email"
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
                        label={"Root Username"}
                        id="rootUsername"
                        type="text"
                        placeholder="Enter root"
                        value={rootUsername}
                        onChange={e => setRootUsername(e.target.value)}
                        error={errorMessage.rootUsername}
                        disabled="disabled"
                    />
                </div>

                <div>
                    <Input
                        label={"Placement"}
                        id="placement"
                        type="text"
                        placeholder="Enter placement"
                        value={placement}
                        onChange={e => setPlacement(e.target.value)}
                        error={errorMessage.placement}
                        disabled="disabled"
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
