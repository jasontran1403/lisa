import Axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";

import Datatable from "../components/datatables/Datatable";
import env from "../helpers/env";
import SearchDataLayout from "../layouts/SearchDataLayout";

const SearchData = () => {
    const [data, setData] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [appraisalToShow, setAppraisalToShow] = useState({});
    const [comparison, setComparison] = useState([]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let configGetInfo = {
                method: "get",
                url: `${env}/api/appraisal/getAll`
            };

            const fetchData = async () => {
                const response = await Axios(configGetInfo);
                setData(
                    response.data.map(item => {
                        return {
                            id: {
                                text: item.id,
                                jsx: (
                                    <div className="flex items-center cursor-pointer hover:cursor-pointer">
                                        {item.id}
                                    </div>
                                )
                            },
                            address: {
                                text: item.address,
                                jsx: (
                                    <div
                                        className="flex text-lg items-center cursor-pointer hover:cursor-pointer"
                                        onClick={() => {
                                            handleShowModal(item.id, item);
                                        }}
                                    >
                                        <span className="font-light">{item.address}</span>
                                    </div>
                                )
                            },
                            createDate: {
                                text: item.createDate,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">{item.createDate}</span>
                                    </div>
                                )
                            },
                            position: {
                                text: item.position,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">{item.position}</span>
                                    </div>
                                )
                            },
                            acreage: {
                                text: item.acreage,
                                jsx: (
                                    <div className="flex items-center">
                                        <span className="font-light">
                                            {item.acreage.toLocaleString()}
                                        </span>
                                    </div>
                                )
                            }
                        };
                    })
                );
            };

            fetchData();

            setLoading(false);
        }, 500);
    }, []);

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            height: "100%",
            width: "100%",
            position: "absolute",
            overflowY: "auto",
            overflowX: "auto"
        }
    };

    const handleShowModal = (appraisalId, appraisal) => {
        let config = {
            method: "get",
            url: `${env}/api/appraisal/comparison=${appraisalId}`
        };

        Axios(config).then(response => {
            console.log(response.data);
            setComparison(response.data);
        });

        setAppraisalToShow(appraisal);
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    return (
        <SearchDataLayout>
            <div className="grid grid-cols-1 mt-7">
                <Datatable
                    head={["ID", "Địa chỉ", "Ngày tạo", "Vị trí", "Diện tích"]}
                    dataProperty={["id", "address", "createDate", "position", "acreage"]}
                    list={data}
                    loading={loading}
                />
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} style={customStyles}>
                <div
                    className="relative overflow-x-auto shadow-md sm:rounded-lg"
                    onClick={handleCloseModal}
                >
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 font-bold">Tiêu chí</td>
                                <td className="text-center border px-4 py-2 font-bold">TSTĐ</td>
                                {comparison.length == 1 && (
                                    <td className="text-center border px-4 py-2 font-bold">
                                        TSSS1
                                    </td>
                                )}
                                {comparison.length == 2 && (
                                    <>
                                        <td className="text-center border px-4 py-2 font-bold">
                                            TSSS1
                                        </td>
                                        <td className="text-center border px-4 py-2 font-bold">
                                            TSSS2
                                        </td>
                                    </>
                                )}
                                {comparison.length == 3 && (
                                    <>
                                        <td className="text-center border px-4 py-2 font-bold">
                                            TSSS1
                                        </td>
                                        <td className="text-center border px-4 py-2 font-bold">
                                            TSSS2
                                        </td>
                                        <td className="text-center border px-4 py-2 font-bold">
                                            TSSS3
                                        </td>
                                    </>
                                )}
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Địa chỉ</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.address}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.address}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.address}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.address}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Nguồn tham khảo</td>
                                <td className="text-center border px-4 py-2"></td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.refference}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.refference}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.refference}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Thời điểm thu thập thông tin</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.createDate}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.createDate}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.createDate}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.createDate}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Pháp lý</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.legal}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.legal}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.legal}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.legal}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Loại đất</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.type}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.type}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.type}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.type}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    Diện tích thửa đất theo giấy chứng nhận (m2)
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.acreage?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.acreage.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.acreage.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.acreage.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Đất NTS (m2)</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.ntsacr?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.ntsacr.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.ntsacr.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.ntsacr.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Đất CLN (m2)</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.clnacr?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.clnacr.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.clnacr.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.clnacr.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    Đất CLN VPLG được công nhận (m2)
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.vplgacr?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.vplgacr.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.vplgacr.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.vplgacr.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Mặt tiền thửa đất (m)</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.width?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.width.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.width.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.width.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Chiều sâu thửa đất (m)</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.height?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.height.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.height.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.height.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Hình dáng thửa đất</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.shape}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.shape}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.shape}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.shape}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Vị trí</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.position}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.position}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.position}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.position}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Giao thông</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.traffic}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.traffic}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.traffic}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.traffic}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Các đặc điểm khác</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.other}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.other}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.other}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.other}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">CTXD trên đất</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.ctxd}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.ctxd}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.ctxd}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.ctxd}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Giá chào bán/chào mua (đồng)</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.priceSale?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.priceSale.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.priceSale.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.priceSale.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    Giá thương lượng/Giá giao dịch thành (đồng)
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.priceDeal?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.priceDeal.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.priceDeal.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.priceDeal.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    Giá trị chuyển mục đích sử dụng đất
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.pricePurpose?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.pricePurpose.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.pricePurpose.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.pricePurpose.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Đất CLN vi phạm lô giới</td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.priceBoundary?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.priceBoundary.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.priceBoundary.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.priceBoundary.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    Giá trị quyền sử dụng đất (đồng)
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.priceLand?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.priceLand.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.priceLand.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.priceLand.toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    Đơn giá quyền sử dụng đất (đồng/m2)
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {appraisalToShow.unitPrice?.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[0]?.unitPrice.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[1]?.unitPrice.toLocaleString()}
                                </td>
                                <td className="text-center border px-4 py-2">
                                    {comparison[2]?.unitPrice.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal>
        </SearchDataLayout>
    );
};

export default SearchData;
