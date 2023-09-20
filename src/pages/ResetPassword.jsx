import Axios from "axios";
import qs from "qs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PrimaryButton } from "../components/buttons";
import { Input } from "../components/field";
import { Link } from "../components/utils";
import { toast } from "../helpers";
import env from "../helpers/env";
import AuthLayout from "../layouts/AuthLayout";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { link } = useParams();
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (newPassword === "" || confirmPassword === "") {
            toast("error", "Please enter new password and confirm password");
            return;
        } else if (newPassword !== confirmPassword) {
            toast("error", "New password and confirm password not match, please try again");
            return;
        } else {
            let data = qs.stringify({
                uuid: link,
                newPassword: newPassword
            });
            let config = {
                method: "post",
                url: `${env}/api/user/resetPassword`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: data
            };

            Axios(config)
                .then(response => {
                    if (response.data === "Reset password link is invalid") {
                        toast("error", "Reset password link is invalid");
                        return;
                    } else {
                        toast("success", "Your password has been updated");
                        navigate("/login");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    return (
        <AuthLayout
            title={
                <>
                    Welcome to <br /> our community
                </>
            }
        >
            <h3 className="text-center text-xl font-semibold text-gray-700">Update password</h3>
            <p className="text-center text-sm mt-2 mb-10">
                Enter and confirm the new password to make the change.
            </p>

            <form className="space-y-5">
                <div>
                    <Input
                        label={"New password"}
                        value={newPassword}
                        id="new_password"
                        type="password"
                        placeholder="Enter new password"
                        onChange={e => {
                            setNewPassword(e.target.value);
                        }}
                    />
                </div>

                <div>
                    <Input
                        label={"Confirm password"}
                        value={confirmPassword}
                        id="confirm_password"
                        type="password"
                        placeholder="Confirm password"
                        onChange={e => {
                            setConfirmPassword(e.target.value);
                        }}
                    />
                </div>

                <PrimaryButton onClick={handleSubmit}>Update Password</PrimaryButton>

                <p className="text-sm text-center">
                    <Link href="/login">Back to Login</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
