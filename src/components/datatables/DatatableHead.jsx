import React from "react";
import styled from "styled-components";

import { Loader } from "../utils";

const DatatableHead = ({
    searchValue = "",
    onChangeSearchValue,
    numberPerPage = 7,
    onChangeNumberPerPage,
    loading = false,
    paginateData = null
}) => {
    return (
        <Container>
            <LeftContainer>
                <SelectLabel>Results: </SelectLabel>
                <Select value={numberPerPage} onChange={e => onChangeNumberPerPage(e.target.value)}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </Select>
            </LeftContainer>

            <RightContainer>
                <div className="relative">
                    <Input
                        className="max-sm:w-20"
                        type="text"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={e => onChangeSearchValue(e.target.value)}
                    />
                    {searchValue.length > 0 && paginateData !== null && loading ? (
                        <Loader
                            color={"indigo"}
                            size={"md"}
                            className="absolute right-0 top-2 mr-2.5 z-50"
                        />
                    ) : (
                        <InputIcon
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </InputIcon>
                    )}
                </div>
            </RightContainer>
        </Container>
    );
};

export default DatatableHead;

const Container = styled.div.attrs(() => ({
    className: "flex items-center justify-between"
}))``;

const LeftContainer = styled.div.attrs(() => ({
    className: "flex items-center"
}))``;

const RightContainer = styled.div.attrs(() => ({
    className: "flex items-center lg:"
}))``;

const Select = styled.select.attrs(() => ({
    className:
        "py-1.5 rounded-md text-xs focus:ring-0 border-gray-300 text-gray-700 focus:border-gray-500"
}))``;

const SelectLabel = styled.span.attrs(() => ({
    className: "text-sm text-gray-500"
}))``;

const Input = styled.input.attrs(() => ({
    className:
        "text-xs text-gray-700 placeholder-gray-300 transition duration-300 border-gray-200 rounded-md pr-9 focus:ring-0 focus:border-gray-500"
}))``;

const InputIcon = styled.svg.attrs(() => ({
    className: "w-6 h-6 absolute right-0 top-1.5 mr-2 text-gray-300"
}))``;
