import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";

import { Loader } from "../utils";

import DatatableFooter from "./DatatableFooter";
import DatatableHead from "./DatatableHead";
import TableHead from "./TableHead";

const Datatable = ({
    list = [],
    loadData = null,
    paginateData = null,
    head = [],
    dataProperty = [],
    loading = false,
    loadDataBySearch = null,
    statusData = null
}) => {
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [numberPerPage, setNumberPerPage] = useState(10);
    const [data, setData] = useState(list);
    const [sort, setSort] = useState(null);

    useEffect(() => {
        if (paginateData) {
            setCurrentPage(paginateData["current_page"]);
            setNumberPerPage(paginateData["per_page"]);
        }
    }, [paginateData]);

    useEffect(() => {
        setData(
            list.map(item => {
                return {
                    ...item,
                    checked: false
                };
            })
        );
        setSort(dataProperty.map(() => null));
    }, [list, dataProperty]);

    const sortFilterResult = useCallback(
        filterResult => {
            if (sort === null) {
                return filterResult;
            }
            let sortValue = null;
            sort.forEach((item, index) => {
                if (item !== null) {
                    sortValue = {
                        index: index,
                        value: item
                    };
                }
            });

            if (sortValue === null) {
                return filterResult;
            }

            return filterResult.sort((a, b) => {
                const firstText = a[dataProperty[sortValue.index]].text
                    ? a[dataProperty[sortValue.index]].text + ""
                    : "";
                const secondText = b[dataProperty[sortValue.index]].text
                    ? b[dataProperty[sortValue.index]].text + ""
                    : "";
                if (sortValue.value === "asc") {
                    if (firstText.toLowerCase() < secondText.toLowerCase()) {
                        return -1;
                    }
                    if (firstText.toLowerCase() > secondText.toLowerCase()) {
                        return 1;
                    }
                } else if (sortValue.value === "desc") {
                    if (firstText.toLowerCase() > secondText.toLowerCase()) {
                        return -1;
                    }
                    if (firstText.toLowerCase() < secondText.toLowerCase()) {
                        return 1;
                    }
                }
                return 0;
            });
        },
        [dataProperty, sort]
    );

    let showData = useMemo(() => {
        const startIndex = (currentPage - 1) * numberPerPage;
        const endIndex = (currentPage - 1) * numberPerPage + numberPerPage;
        if (searchValue.length && paginateData === null) {
            const result = data
                .filter(item => {
                    let found = false;
                    dataProperty.forEach(property => {
                        const text = item[property].text ? item[property].text + "" : "";
                        found = found || text.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
                    });
                    return found;
                })
                .slice(startIndex, endIndex);
            return sortFilterResult(result);
        }
        return sortFilterResult(paginateData ? data : data.slice(startIndex, endIndex));
    }, [
        currentPage,
        numberPerPage,
        searchValue,
        data,
        dataProperty,
        sortFilterResult,
        paginateData
    ]);

    const totalPage = useMemo(() => {
        return paginateData ? paginateData["last_page"] : Math.ceil(data.length / numberPerPage);
    }, [data, numberPerPage, paginateData]);

    const searchFirstElementPageNumber = useCallback(
        newPerPage => {
            if (searchValue.length || data.length === 0) return 1;
            const totalPage = Math.ceil(data.length / newPerPage);
            const firstElement = showData[0];
            let i;
            let searchPage = 0;
            for (i = 0; i < totalPage; i++) {
                const startIndex = i * newPerPage;
                const endIndex = startIndex + newPerPage;
                const tab = [...data].slice(startIndex, endIndex);
                let i1;
                for (i1 = 0; i1 < tab.length; i1++) {
                    if (tab[i1].id === firstElement.id) {
                        searchPage = i + 1;
                        break;
                    }
                }
                if (searchPage) break;
            }
            return searchPage;
        },
        [data, searchValue.length, showData]
    );

    const handlePerPageChange = useCallback(
        value => {
            if (value !== numberPerPage) {
                if (paginateData && loadData) {
                    loadData(parseInt(value), 1, null, true, searchValue);
                } else {
                    setCurrentPage(searchFirstElementPageNumber(parseInt(value)));
                }
                setNumberPerPage(parseInt(value));
            }
        },
        [loadData, numberPerPage, paginateData, searchFirstElementPageNumber, searchValue]
    );

    const sortData = indexSort => {
        setSort(s =>
            s.map((item, index) => {
                if (index === indexSort) {
                    switch (item) {
                        case "asc":
                            return "desc";
                        case "desc":
                            return "asc";
                        default:
                            return "asc";
                    }
                }
                return null;
            })
        );
        setCurrentPage(1);
        if (paginateData && loadData) {
            loadData(numberPerPage, 1, null, true, searchValue, statusData);
        }
    };

    const nextPage = useCallback(() => {
        if (currentPage !== totalPage) {
            if (paginateData && loadData) {
                loadData(numberPerPage, currentPage + 1, null, true, searchValue, statusData);
            }
            setCurrentPage(c => c + 1);
        }
    }, [currentPage, loadData, numberPerPage, paginateData, searchValue, statusData, totalPage]);

    const previousPage = useCallback(() => {
        if (currentPage !== 1) {
            if (paginateData && loadData) {
                loadData(numberPerPage, currentPage - 1, null, true, searchValue, statusData);
            }
            setCurrentPage(c => c - 1);
        }
    }, [currentPage, loadData, numberPerPage, paginateData, searchValue, statusData]);

    const gotoPage = useCallback(
        number => {
            if (number !== currentPage) {
                if (paginateData && loadData) {
                    loadData(numberPerPage, number, null, true, searchValue, statusData);
                }
                setCurrentPage(number);
            }
        },
        [currentPage, loadData, numberPerPage, paginateData, searchValue, statusData]
    );

    const changeCheckValue = useCallback(
        value => {
            const currentPageDataIds = showData.map(item => item.id);
            setData(d =>
                d.map(item => {
                    if (currentPageDataIds.includes(item.id)) {
                        return {
                            ...item,
                            checked: value
                        };
                    }
                    return item;
                })
            );
        },
        [showData]
    );

    const searchByValue = value => {
        if (paginateData && loadDataBySearch) {
            loadDataBySearch(value);
        }
        setSearchValue(value);
    };

    return (
        <Container>
            <DatatableHead
                data={data}
                searchValue={searchValue}
                onChangeSearchValue={searchByValue}
                numberPerPage={numberPerPage}
                onChangeNumberPerPage={handlePerPageChange}
                paginateData={paginateData}
                loading={loading}
            />

            <div className="overflow-y-visible overflow-x-auto">
                <table className="w-full table-auto text-sm">
                    <TableHead
                        head={head}
                        onChangeCheckValue={changeCheckValue}
                        sort={sort}
                        onSort={sortData}
                        paginateData={paginateData}
                    />

                    <tbody>
                        {showData.map((item, index) => (
                            <tr key={index} className="border-b odd:bg-gray-100">
                                {dataProperty.map((property, index) => (
                                    <TableItem key={index}>{item[property].jsx}</TableItem>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {loading && (
                <div className="w-full flex items-center justify-center py-5">
                    <Loader color={"indigo"} size={"lg"} />
                </div>
            )}

            <DatatableFooter
                totalPage={totalPage}
                currentPage={currentPage}
                next={nextPage}
                previous={previousPage}
                gotoPage={gotoPage}
            />
        </Container>
    );
};

export default Datatable;

const Container = styled.div.attrs(() => ({
    className: "bg-white w-full border rounded-md text-red-500 p-4 md:p-8"
}))``;

const TableItem = styled.td.attrs(props => ({
    className: `px-4 py-5 font-normal text-${
        ["left", "center", "right"].includes(props.position) ? props.position : "left"
    } text-gray-600`
}))``;
