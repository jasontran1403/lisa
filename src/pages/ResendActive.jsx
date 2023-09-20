import Axios from "axios";
import qs from "qs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "../components/buttons";
import { Input } from "../components/field";
import { Link } from "../components/utils";
import env from "../helpers/env";
import { toast } from "../helpers/index";
import AuthLayout from "../layouts/AuthLayout";

const ResendActive = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    const hanleSubmit = () => {
        if (username === null) {
            alert("Please enter username to get new verification code");
            return;
        } else {
            let data = qs.stringify({
                username: username
            });
            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${env}/api/user/active/resend`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: data
            };

            Axios(config).then(response => {
                if (response.data === "Cannot find your usename, please try again") {
                    toast("error", "Cannot find your usename, please try again");
                } else {
                    navigate(`/active-account/${response.data}`);
                }
            });
        }
    };

    return (
        <AuthLayout>
            <h3 className="text-center text-xl font-semibold text-gray-700">Activation account</h3>

            <form className="space-y-5">
                <div>
                    <Input
                        label={"Username"}
                        type="text"
                        value={username}
                        placeholder="Enter your username"
                        onChange={e => {
                            setUsername(e.target.value);
                        }}
                    />
                </div>

                <PrimaryButton onClick={hanleSubmit}>Re-send</PrimaryButton>

                <p className="text-sm text-center">
                    <Link href="/login">Back to Login</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default ResendActive;
