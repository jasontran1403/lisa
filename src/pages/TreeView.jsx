import Axios from "axios";
import qs from "qs";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../assets/TreeView.css";

import Button from "../components/Button";
import config from "../config";
import env from "../helpers/env";
import AdminLayout from "../layouts/AdminLayout";

Modal.setAppElement(document.getElementById("root"));
const TreeView = () => {
    const currentUsername = config.AUTH.DRIVER.getItem("username");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [userRoot, setUserRoot] = useState({});
    const [refF1, setRefF1] = useState([]);
    const [refF2, setRefF2] = useState([]);
    const [refF3, setRefF3] = useState([]);
    const [refF4, setRefF4] = useState([]);

    useEffect(() => {
        // Get Root info
        let config = {
            method: "get",
            url: `${env}/api/userMapDown5Level/${currentUsername}`
        };

        Axios(config).then(response => {
            setUserRoot(response.data.Root[0]);
            setRefF1(response.data.L1);
            setRefF2(response.data.L2);
            setRefF3(response.data.L3);
            setRefF4(response.data.L4);
        });
    }, [currentUsername]);

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)"
        }
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleGenerateRef = (placement, side) => {
        let configGetIfExisted = {
            method: "get",
            url: `${env}/api/affiliate/getByPlacement/${placement}/${side}`
        };

        Axios(configGetIfExisted).then(response => {
            if (response.data) {
                setUrl(`http://183.80.19.88:3000/register/${response.data.uuid}`);
            } else {
                let data = qs.stringify({
                    root: currentUsername,
                    placement: placement,
                    side: side
                });

                let config = {
                    method: "post",
                    url: `${env}/api/affiliate/generate`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: data
                };

                Axios(config).then(response => {
                    setUrl(`http://183.80.19.88:3000/register/${response.data.uuid}`);
                });
            }
        });
        setIsOpen(true);
    };

    const handleOpenModal = username => {
        if (username === null) {
            return;
        } else {
            let config = {
                method: "get",
                url: `${env}/api/userMapDown5Level/${username}`
            };

            Axios(config).then(response => {
                setUserRoot(response.data.Root[0]);
                setRefF1(response.data.L1);
                setRefF2(response.data.L2);
                setRefF3(response.data.L3);
                setRefF4(response.data.L4);
            });
        }
    };

    return (
        <AdminLayout>
            <div className="tree">
                <ul className="tree-ul">
                    <li>
                        <a>
                            <p>{userRoot.username}</p>
                            <p className="sponsor">Sponsor: {userRoot.rootUsername}</p>
                        </a>
                        <ul>
                            {refF1[0]?.username === null ? (
                                <li>
                                    <a>
                                        <Button
                                            handleClick={() =>
                                                handleGenerateRef(userRoot.username, "left")
                                            }
                                        />
                                    </a>
                                </li>
                            ) : (
                                <li>
                                    <a
                                        onClick={() => {
                                            handleOpenModal(refF1[0]?.username);
                                        }}
                                        style={{ color: "#34bfed" }}
                                    >
                                        {refF1[0] ? (
                                            refF1[0].username === null ? (
                                                <Button
                                                    handleClick={() =>
                                                        handleGenerateRef(currentUsername, "left")
                                                    }
                                                />
                                            ) : (
                                                <>
                                                    <p>{refF1[0].username}</p>
                                                    <p className="sponsor">
                                                        Sponsor: {refF1[0].rootUsername}
                                                    </p>
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <Button handleClick={handleGenerateRef} />
                                            </>
                                        )}
                                    </a>
                                    <ul>
                                        {/* F2 trái */}
                                        {refF2[0]?.username === null ? (
                                            <li>
                                                <a>
                                                    <Button
                                                        handleClick={() =>
                                                            handleGenerateRef(
                                                                refF1[0].username,
                                                                "left"
                                                            )
                                                        }
                                                    />
                                                </a>
                                            </li>
                                        ) : (
                                            <li>
                                                <a
                                                    onClick={() => {
                                                        handleOpenModal(refF2[0]?.username);
                                                    }}
                                                    style={{ color: "red" }}
                                                >
                                                    {refF2[0] ? (
                                                        refF2[0].username === null ? (
                                                            <Button
                                                                handleClick={() =>
                                                                    handleGenerateRef(
                                                                        refF1[0].username,
                                                                        "left"
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <>
                                                                <p>{refF2[0].username}</p>
                                                                <p className="sponsor">
                                                                    Sponsor: {refF2[0].rootUsername}
                                                                </p>
                                                            </>
                                                        )
                                                    ) : (
                                                        <>
                                                            3
                                                            <Button
                                                                handleClick={handleGenerateRef}
                                                            />
                                                        </>
                                                    )}
                                                </a>
                                                <ul>
                                                    {/* F3 trái */}
                                                    {refF3[0]?.username === null ? (
                                                        <li>
                                                            <a>
                                                                <Button
                                                                    handleClick={() =>
                                                                        handleGenerateRef(
                                                                            refF2[0].username,
                                                                            "left"
                                                                        )
                                                                    }
                                                                />
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <a
                                                                onClick={() => {
                                                                    handleOpenModal(
                                                                        refF3[0]?.username
                                                                    );
                                                                }}
                                                                style={{ color: "red" }}
                                                            >
                                                                {refF3[0] ? (
                                                                    refF3[0].username === null ? (
                                                                        <Button
                                                                            handleClick={() =>
                                                                                handleGenerateRef(
                                                                                    refF2[0]
                                                                                        .username,
                                                                                    "left"
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <p>
                                                                                {refF3[0].username}
                                                                            </p>
                                                                            <p className="sponsor">
                                                                                Sponsor:
                                                                                {
                                                                                    refF3[0]
                                                                                        .rootUsername
                                                                                }
                                                                            </p>
                                                                        </>
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        7
                                                                        <Button
                                                                            handleClick={
                                                                                handleGenerateRef
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </a>
                                                            <ul>
                                                                {/* F4 trái */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[0]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "red" }}
                                                                    >
                                                                        {/* suawr truoc dong null */}
                                                                        {refF4[0] ? (
                                                                            refF4[0].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[0]
                                                                                                .username,
                                                                                            "left"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[0]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[0]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                15
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                                {/* F4 phải */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[1]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "red" }}
                                                                    >
                                                                        {refF4[1] ? (
                                                                            refF4[1].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[0]
                                                                                                .username,
                                                                                            "right"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[1]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[1]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                16
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )}
                                                    {/* F3 phải */}
                                                    {refF3[1]?.username === null ? (
                                                        <li>
                                                            <a>
                                                                <Button
                                                                    handleClick={() =>
                                                                        handleGenerateRef(
                                                                            refF2[0].username,
                                                                            "right"
                                                                        )
                                                                    }
                                                                />
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <a
                                                                onClick={() => {
                                                                    handleOpenModal(
                                                                        refF3[1]?.username
                                                                    );
                                                                }}
                                                                style={{ color: "red" }}
                                                            >
                                                                {refF3[1] ? (
                                                                    refF3[1].username === null ? (
                                                                        <Button
                                                                            handleClick={() =>
                                                                                handleGenerateRef(
                                                                                    refF2[0]
                                                                                        .username,
                                                                                    "right"
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <p>
                                                                                {refF3[1].username}
                                                                            </p>
                                                                            <p className="sponsor">
                                                                                Sponsor:
                                                                                {
                                                                                    refF3[1]
                                                                                        .rootUsername
                                                                                }
                                                                            </p>
                                                                        </>
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        8
                                                                        <Button
                                                                            handleClick={
                                                                                handleGenerateRef
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </a>
                                                            <ul>
                                                                {/* F4 trái */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[2]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "red" }}
                                                                    >
                                                                        {refF4[2] ? (
                                                                            refF4[2].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[1]
                                                                                                .username,
                                                                                            "left"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[2]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[2]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                17
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                                {/* F4 phải */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[3]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "red" }}
                                                                    >
                                                                        {refF4[3] ? (
                                                                            refF4[3].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[1]
                                                                                                .username,
                                                                                            "right"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[3]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[3]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                18
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )}
                                                </ul>
                                            </li>
                                        )}

                                        {/* F2 phải */}
                                        {refF2[1]?.username === null ? (
                                            <li>
                                                <a>
                                                    <Button
                                                        handleClick={() =>
                                                            handleGenerateRef(
                                                                refF1[0].username,
                                                                "right"
                                                            )
                                                        }
                                                    />
                                                </a>
                                            </li>
                                        ) : (
                                            <li>
                                                <a
                                                    onClick={() => {
                                                        handleOpenModal(refF2[1]?.username);
                                                    }}
                                                    style={{ color: "orange" }}
                                                >
                                                    {refF2[1] ? (
                                                        refF2[1].username === null ? (
                                                            <Button
                                                                handleClick={() =>
                                                                    handleGenerateRef(
                                                                        refF1[0].username,
                                                                        "right"
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <>
                                                                <p>{refF2[1].username}</p>
                                                                <p className="sponsor">
                                                                    Sponsor: {refF2[1].rootUsername}
                                                                </p>
                                                            </>
                                                        )
                                                    ) : (
                                                        <>
                                                            4
                                                            <Button
                                                                handleClick={handleGenerateRef}
                                                            />
                                                        </>
                                                    )}
                                                </a>
                                                <ul>
                                                    {/* F3 trái */}
                                                    {refF3[2]?.username === null ? (
                                                        <li>
                                                            <a>
                                                                <Button
                                                                    handleClick={() =>
                                                                        handleGenerateRef(
                                                                            refF2[1].username,
                                                                            "left"
                                                                        )
                                                                    }
                                                                />
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <a
                                                                onClick={() => {
                                                                    handleOpenModal(
                                                                        refF3[2]?.username
                                                                    );
                                                                }}
                                                                style={{ color: "orange" }}
                                                            >
                                                                {refF3[2] ? (
                                                                    refF3[2].username === null ? (
                                                                        <Button
                                                                            handleClick={() =>
                                                                                handleGenerateRef(
                                                                                    refF2[1]
                                                                                        .username,
                                                                                    "left"
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <p>
                                                                                {refF3[2].username}
                                                                            </p>
                                                                            <p className="sponsor">
                                                                                Sponsor:
                                                                                {
                                                                                    refF3[2]
                                                                                        .rootUsername
                                                                                }
                                                                            </p>
                                                                        </>
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        9
                                                                        <Button
                                                                            handleClick={
                                                                                handleGenerateRef
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </a>
                                                            <ul>
                                                                {/* F4 trái */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[4]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "orange" }}
                                                                    >
                                                                        {refF4[4] ? (
                                                                            refF4[4].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[2]
                                                                                                .username,
                                                                                            "left"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[4]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[4]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                19
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                                {/* F4 phải */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[5]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "orange" }}
                                                                    >
                                                                        {refF4[5] ? (
                                                                            refF4[5].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[2]
                                                                                                .username,
                                                                                            "right"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[5]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[5]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                20
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )}
                                                    {/* F3 phải */}
                                                    {refF3[3]?.username === null ? (
                                                        <li>
                                                            <a>
                                                                <Button
                                                                    handleClick={() =>
                                                                        handleGenerateRef(
                                                                            refF2[1].username,
                                                                            "right"
                                                                        )
                                                                    }
                                                                />
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <a
                                                                onClick={() => {
                                                                    handleOpenModal(
                                                                        refF3[3]?.username
                                                                    );
                                                                }}
                                                                style={{ color: "orange" }}
                                                            >
                                                                {refF3[3] ? (
                                                                    refF3[3].username === null ? (
                                                                        <Button
                                                                            handleClick={() =>
                                                                                handleGenerateRef(
                                                                                    refF2[1]
                                                                                        .username,
                                                                                    "right"
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <p>
                                                                                {refF3[3].username}
                                                                            </p>
                                                                            <p className="sponsor">
                                                                                Sponsor:
                                                                                {
                                                                                    refF3[3]
                                                                                        .rootUsername
                                                                                }
                                                                            </p>
                                                                        </>
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        10
                                                                        <Button
                                                                            handleClick={
                                                                                handleGenerateRef
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </a>
                                                            <ul>
                                                                {/* F4 trái */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[6]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "orange" }}
                                                                    >
                                                                        {refF4[6] ? (
                                                                            refF4[6].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[3]
                                                                                                .username,
                                                                                            "left"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[6]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[6]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                21
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                                {/* F4 phải */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[7]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "orange" }}
                                                                    >
                                                                        {refF4[7] ? (
                                                                            refF4[7].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[3]
                                                                                                .username,
                                                                                            "right"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[7]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[7]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                22
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )}
                                                </ul>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            )}

                            {/* Nhánh phải */}
                            {/* F1 phải */}
                            {refF1[1]?.username === null ? (
                                <li>
                                    <a>
                                        <Button
                                            handleClick={() =>
                                                handleGenerateRef(userRoot.username, "right")
                                            }
                                        />
                                    </a>
                                </li>
                            ) : (
                                <li>
                                    <a
                                        onClick={() => {
                                            handleOpenModal(refF1[1]?.username);
                                        }}
                                        style={{ color: "#f09e1a" }}
                                    >
                                        {refF1[1] ? (
                                            refF1[1].username === null ? (
                                                <Button
                                                    handleClick={() =>
                                                        handleGenerateRef(
                                                            userRoot.username,
                                                            "right"
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <>
                                                    <p>{refF1[1].username}</p>
                                                    <p className="sponsor">
                                                        Sponsor: {refF1[1].rootUsername}
                                                    </p>
                                                </>
                                            )
                                        ) : (
                                            <>
                                                2
                                                <Button handleClick={handleGenerateRef} />
                                            </>
                                        )}
                                    </a>
                                    <ul>
                                        {/* F2 trái */}
                                        {refF2[2]?.username === null ? (
                                            <li>
                                                <a>
                                                    <Button
                                                        handleClick={() =>
                                                            handleGenerateRef(
                                                                refF1[1].username,
                                                                "left"
                                                            )
                                                        }
                                                    />
                                                </a>
                                            </li>
                                        ) : (
                                            <li>
                                                <a
                                                    onClick={() => {
                                                        handleOpenModal(refF2[2]?.username);
                                                    }}
                                                    style={{ color: "blue" }}
                                                >
                                                    {refF2[2] ? (
                                                        refF2[2].username === null ? (
                                                            <Button
                                                                handleClick={() =>
                                                                    handleGenerateRef(
                                                                        refF1[1].username,
                                                                        "left"
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <>
                                                                <p>{refF2[2].username}</p>
                                                                <p className="sponsor">
                                                                    Sponsor: {refF2[2].rootUsername}
                                                                </p>
                                                            </>
                                                        )
                                                    ) : (
                                                        <>
                                                            5
                                                            <Button
                                                                handleClick={handleGenerateRef}
                                                            />
                                                        </>
                                                    )}
                                                </a>
                                                <ul>
                                                    {/* F3 trái */}
                                                    {refF3[4]?.username === null ? (
                                                        <li>
                                                            <a>
                                                                <Button
                                                                    handleClick={() =>
                                                                        handleGenerateRef(
                                                                            refF2[2].username,
                                                                            "left"
                                                                        )
                                                                    }
                                                                />
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <a
                                                                onClick={() => {
                                                                    handleOpenModal(
                                                                        refF3[4]?.username
                                                                    );
                                                                }}
                                                                style={{ color: "blue" }}
                                                            >
                                                                {refF3[4] ? (
                                                                    refF3[4].username === null ? (
                                                                        <Button
                                                                            handleClick={() =>
                                                                                handleGenerateRef(
                                                                                    refF2[2]
                                                                                        .username,
                                                                                    "left"
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <p>
                                                                                {refF3[4].username}
                                                                            </p>
                                                                            <p className="sponsor">
                                                                                Sponsor:
                                                                                {
                                                                                    refF3[4]
                                                                                        .rootUsername
                                                                                }
                                                                            </p>
                                                                        </>
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        11
                                                                        <Button
                                                                            handleClick={
                                                                                handleGenerateRef
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </a>
                                                            <ul>
                                                                {/* F4 trái */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[8]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "blue" }}
                                                                    >
                                                                        {refF4[8] ? (
                                                                            refF4[8].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[4]
                                                                                                .username,
                                                                                            "left"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[8]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[8]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                23
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                                {/* F4 phải */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[9]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "blue" }}
                                                                    >
                                                                        {refF4[9] ? (
                                                                            refF4[9].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[4]
                                                                                                .username,
                                                                                            "right"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[9]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[9]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                24
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )}
                                                    {/* F3 phải */}
                                                    {refF3[5]?.username === null ? (
                                                        <li>
                                                            <a>
                                                                <Button
                                                                    handleClick={() =>
                                                                        handleGenerateRef(
                                                                            refF2[2].username,
                                                                            "right"
                                                                        )
                                                                    }
                                                                />
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <a
                                                                onClick={() => {
                                                                    handleOpenModal(
                                                                        refF3[5]?.username
                                                                    );
                                                                }}
                                                                style={{ color: "blue" }}
                                                            >
                                                                {refF3[5] ? (
                                                                    refF3[5].username === null ? (
                                                                        <Button
                                                                            handleClick={() =>
                                                                                handleGenerateRef(
                                                                                    refF2[2]
                                                                                        .username,
                                                                                    "right"
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <p>
                                                                                {refF3[5].username}
                                                                            </p>
                                                                            <p className="sponsor">
                                                                                Sponsor:
                                                                                {
                                                                                    refF3[5]
                                                                                        .rootUsername
                                                                                }
                                                                            </p>
                                                                        </>
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        12
                                                                        <Button
                                                                            handleClick={
                                                                                handleGenerateRef
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </a>
                                                            <ul>
                                                                {/* F4 trái */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[10]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "blue" }}
                                                                    >
                                                                        {refF4[10] ? (
                                                                            refF4[10].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[5]
                                                                                                .username,
                                                                                            "left"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[10]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[10]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                25
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                                {/* F4 phải */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[11]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "blue" }}
                                                                    >
                                                                        {refF4[11] ? (
                                                                            refF4[11].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[5]
                                                                                                .username,
                                                                                            "right"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[11]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[11]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                26
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )}
                                                </ul>
                                            </li>
                                        )}

                                        {/* F2 phải */}
                                        {refF2[3]?.username === null ? (
                                            <li>
                                                <a>
                                                    <Button
                                                        handleClick={() =>
                                                            handleGenerateRef(
                                                                refF1[1].username,
                                                                "right"
                                                            )
                                                        }
                                                    />
                                                </a>
                                            </li>
                                        ) : (
                                            <li>
                                                <a
                                                    onClick={() => {
                                                        handleOpenModal(refF2[3]?.username);
                                                    }}
                                                    style={{ color: "green" }}
                                                >
                                                    {refF2[3] ? (
                                                        refF2[3].username === null ? (
                                                            <Button
                                                                handleClick={() =>
                                                                    handleGenerateRef(
                                                                        refF1[1].username,
                                                                        "right"
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <>
                                                                <p>{refF2[3].username}</p>
                                                                <p className="sponsor">
                                                                    Sponsor: {refF2[3].rootUsername}
                                                                </p>
                                                            </>
                                                        )
                                                    ) : (
                                                        <>
                                                            6
                                                            <Button
                                                                handleClick={handleGenerateRef}
                                                            />
                                                        </>
                                                    )}
                                                </a>
                                                <ul>
                                                    {/* F3 trái */}
                                                    {refF3[6]?.username === null ? (
                                                        <li>
                                                            <a>
                                                                <Button
                                                                    handleClick={() =>
                                                                        handleGenerateRef(
                                                                            refF2[3].username,
                                                                            "left"
                                                                        )
                                                                    }
                                                                />
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <a
                                                                onClick={() => {
                                                                    handleOpenModal(
                                                                        refF3[6]?.username
                                                                    );
                                                                }}
                                                                style={{ color: "green" }}
                                                            >
                                                                {refF3[6] ? (
                                                                    refF3[6].username === null ? (
                                                                        <Button
                                                                            handleClick={() =>
                                                                                handleGenerateRef(
                                                                                    refF2[3]
                                                                                        .username,
                                                                                    "left"
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <p>
                                                                                {refF3[6].username}
                                                                            </p>
                                                                            <p className="sponsor">
                                                                                Sponsor:
                                                                                {
                                                                                    refF3[6]
                                                                                        .rootUsername
                                                                                }
                                                                            </p>
                                                                        </>
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        13
                                                                        <Button
                                                                            handleClick={
                                                                                handleGenerateRef
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </a>
                                                            <ul>
                                                                {/* F4 trái */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[12]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "green" }}
                                                                    >
                                                                        {refF4[12] ? (
                                                                            refF4[12].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[6]
                                                                                                .username,
                                                                                            "left"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[12]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[12]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                27
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                                {/* F4 phải */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[13]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "green" }}
                                                                    >
                                                                        {refF4[13] ? (
                                                                            refF4[13].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[6]
                                                                                                .username,
                                                                                            "right"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[13]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[13]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                28
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )}
                                                    {/* F3 phải */}
                                                    {refF3[7]?.username === null ? (
                                                        <li>
                                                            <a>
                                                                <Button
                                                                    handleClick={() =>
                                                                        handleGenerateRef(
                                                                            refF2[3].username,
                                                                            "right"
                                                                        )
                                                                    }
                                                                />
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li>
                                                            <a
                                                                onClick={() => {
                                                                    handleOpenModal(
                                                                        refF3[7]?.username
                                                                    );
                                                                }}
                                                                style={{ color: "green" }}
                                                            >
                                                                {refF3[7] ? (
                                                                    refF3[7].username === null ? (
                                                                        <Button
                                                                            handleClick={() =>
                                                                                handleGenerateRef(
                                                                                    refF2[3]
                                                                                        .username,
                                                                                    "right"
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <p>
                                                                                {refF3[7].username}
                                                                            </p>
                                                                            <p className="sponsor">
                                                                                Sponsor:
                                                                                {
                                                                                    refF3[7]
                                                                                        .rootUsername
                                                                                }
                                                                            </p>
                                                                        </>
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        14
                                                                        <Button
                                                                            handleClick={
                                                                                handleGenerateRef
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </a>
                                                            <ul>
                                                                {/* F4 trái */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[14]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "green" }}
                                                                    >
                                                                        {refF4[14] ? (
                                                                            refF4[14].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[7]
                                                                                                .username,
                                                                                            "left"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[14]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[14]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                29
                                                                                <Button
                                                                                    handleClick={() => {
                                                                                        handleGenerateRef(
                                                                                            refF3[7]
                                                                                                .username
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                                {/* F4 phải */}
                                                                <li>
                                                                    <a
                                                                        onClick={() => {
                                                                            handleOpenModal(
                                                                                refF4[15]?.username
                                                                            );
                                                                        }}
                                                                        style={{ color: "green" }}
                                                                    >
                                                                        {refF4[15] ? (
                                                                            refF4[15].username ===
                                                                            null ? (
                                                                                <Button
                                                                                    handleClick={() =>
                                                                                        handleGenerateRef(
                                                                                            refF3[7]
                                                                                                .username,
                                                                                            "right"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p>
                                                                                        {
                                                                                            refF4[15]
                                                                                                .username
                                                                                        }
                                                                                    </p>
                                                                                    <p className="sponsor">
                                                                                        Sponsor:
                                                                                        {
                                                                                            refF4[15]
                                                                                                .rootUsername
                                                                                        }
                                                                                    </p>
                                                                                </>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                30
                                                                                <Button
                                                                                    handleClick={
                                                                                        handleGenerateRef
                                                                                    }
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )}
                                                </ul>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </li>
                </ul>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
                <form className="flex flex-col justify-center items-center">
                    Reflink:
                    <input className="flex text-center mb-10 w-96" value={url} readOnly />
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default TreeView;
