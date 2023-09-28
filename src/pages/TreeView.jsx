import Axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../assets/TreeView.css";

import config from "../config";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";

Modal.setAppElement(document.getElementById("root"));
const TreeView = () => {
    const currentEmail = config.AUTH.DRIVER.getItem("email");
    const [currentNetwork, setCurrentNetwork] = useState([]);
    const access_token = localStorage.getItem("access_token");
    const [prevRoot, setPrevRoot] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState("");

    useEffect(() => {
        fetchMoreNetwork(currentEmail);
    }, [currentEmail]);

    const fetchMoreNetwork = email => {
        setIsLoading(true);
        setCurrentView(email);
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            // ${env} http://localhost:8080
            url: `${env}/api/v1/demo/get-network/${email}`,
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        };

        Axios.request(config)
            .then(response => {
                setCurrentNetwork([...response.data[1]]);
            })
            .catch(error => {
                console.log(error);
            });

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const handleGoBack = () => {
        const cur = prevRoot.pop();
        fetchMoreNetwork(cur);
    };

    const handleGoNext = (current, prev) => {
        setPrevRoot([...prevRoot, prev]);
        fetchMoreNetwork(current);
    };

    return (
        <AdminLayout>
            <div className="tree">
                {isLoading ? (
                    <div className="loader"></div>
                ) : (
                    <>
                        <span className="card__title">Network của {currentView}</span>
                        <ul className="tree-ul">
                            {prevRoot.length > 0 ? (
                                <button className="btnBack" onClick={handleGoBack}>
                                    Quay lại
                                </button>
                            ) : (
                                ""
                            )}
                            {currentNetwork.length > 0 ? (
                                <ul className="card">
                                    {currentNetwork.map((item, index) => (
                                        <li key={index}>
                                            <p
                                                className="ref card__title"
                                                onClick={() => {
                                                    handleGoNext(item.email, item.refferal);
                                                }}
                                            >
                                                + {item.email}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="card__title">Không có dữ liệu</p>
                            )}
                        </ul>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default TreeView;
