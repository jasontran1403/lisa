import Axios from "axios";
import qs from "qs";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { PrimaryButton } from "../components/buttons";
import { Input } from "../components/field";
import { Link } from "../components/utils";
import env from "../helpers/env";
import { toast } from "../helpers/index";
import AuthLayout from "../layouts/AuthLayout";

const Active = () => {
    const navigate = useNavigate();
    const { link } = useParams();
    const [veriCode, setVeriCode] = useState("");

    const hanleSubmit = () => {
        let data = qs.stringify({
            activecode: veriCode
        });
        let config = {
            method: "post",
            url: `${env}/api/user/active/${link}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: data
        };
        console.log(config.url);

        Axios(config).then(response => {
            if (response.data === "Activation success") {
                toast("success", "Activation success");
                navigate("/login");
            } else {
                toast("error", "Activation fail, please try again");
            }
        });
    };

    return (
        <AuthLayout>
            <h3 className="text-center text-xl font-semibold text-gray-700">Activation accoung</h3>

            <form className="space-y-5">
                <div>
                    <Input
                        label={"Activation Code"}
                        id="new_password"
                        type="text"
                        value={veriCode}
                        placeholder="Enter code"
                        onChange={e => {
                            setVeriCode(e.target.value);
                        }}
                    />
                </div>

                <PrimaryButton onClick={hanleSubmit}>Active</PrimaryButton>

                <p className="text-sm text-center">
                    <Link href="/login">Back to Login</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Active;
