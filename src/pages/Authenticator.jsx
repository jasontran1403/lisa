import Axios from "axios";
import React, { useState, useEffect } from "react";
import { BiCopy } from "react-icons/bi";

import config from "../config";
import { toast } from "../helpers";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";

const Authenticator = () => {
    const currentEmail = config.AUTH.DRIVER.getItem("email");
    const currentAccessToken = config.AUTH.DRIVER.getItem("access_token");
    const [secretPhrase, setSecretPhrase] = useState("");
    const [qrImg, setQrImg] = useState("");
    const [authenCode, setAuthenCode] = useState("");
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${env}/api/v1/demo/showQR/${currentEmail}`,
            headers: { Authorization: `Bearer ${currentAccessToken}` }
        };

        Axios(config).then(response => {
            setIsEnabled(response.data[0]);
            setSecretPhrase(response.data[1]);
            setQrImg(response.data[2]);
        });
    }, [currentEmail, currentAccessToken]);

    const handleEnabled = () => {
        let data = JSON.stringify({
            email: currentEmail,
            code: authenCode
        });

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${env}/api/v1/demo/enable`,
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
                    if (response.data === "Enabled Success") {
                        toast("success", "Enable 2FA success");
                    } else {
                        toast("error", "Enable 2FA failed, wrong 2FA code");
                    }
                });
                window.Swal.fire("Confirmed!", "2FA has been enabled.", "success");
            }
        });
    };

    const handleDisabled = () => {
        let data = JSON.stringify({
            email: currentEmail,
            code: authenCode
        });

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${env}/api/v1/demo/disable`,
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
                    if (response.data === "Disabled Success") {
                        toast("success", "Disabled 2FA success");
                    } else {
                        toast("error", "Enable 2FA failed, wrong 2FA code");
                    }
                });
                window.Swal.fire("Confirmed!", "2FA has been disabled.", "success");
            }
        });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(secretPhrase).then(function () {
            alert("Copied to clipboard");
        });
    };

    return (
        <AdminLayout>
            <div className="px-4 py-3 bg-white border rounded-md shadow-xs col-span-full">
                {isEnabled === "true" ? (
                    <>
                        <div className="flex justify-center col-span-6 mt-3 min-w-min">
                            <p className="flex text-2xl font-light text-orange-500 transition-all duration-300">
                                6-digits 2FA:
                                <input
                                    className="select"
                                    type="text"
                                    value={authenCode}
                                    onChange={e => {
                                        setAuthenCode(e.target.value);
                                    }}
                                />
                            </p>
                        </div>

                        <div className="flex justify-center col-span-1 mt-3">
                            <div className="px-2 py-1 font-semibold text-black-300 bg-emerald-400 rounded">
                                <button className="place-items-center" onClick={handleDisabled}>
                                    Disabled
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center col-span-6 mt-3 min-w-min">
                            <img src={qrImg} />
                        </div>

                        <p className="flex justify-center text-m font-light text-orange-500 transition-all duration-300">
                            Secret Phrase: {secretPhrase}
                            <BiCopy
                                style={{
                                    color: "red",
                                    cursor: "pointer",
                                    marginLeft: "5px",
                                    marginTop: "3px"
                                }}
                                onClick={handleCopy}
                            />
                        </p>

                        <div className="flex justify-center col-span-6 mt-3 min-w-min">
                            <p className="flex text-2xl font-light text-orange-500 transition-all duration-300">
                                6-digits 2FA:
                                <input
                                    type="text"
                                    value={authenCode}
                                    onChange={e => {
                                        setAuthenCode(e.target.value);
                                    }}
                                />
                            </p>
                        </div>

                        <div className="flex justify-center col-span-1 mt-3">
                            <div className="px-2 py-1 font-semibold text-black-300 bg-emerald-400 rounded">
                                <button className="place-items-center" onClick={handleEnabled}>
                                    Enable
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default Authenticator;
