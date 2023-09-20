import React from "react";
import styled from "styled-components";

const TableHead = ({ head = [], sort = null, onSort, paginateData = null }) => {
    return (
        <Container>
            <tr>
                {head.map((item, index) => (
                    <HeadItem onClick={() => onSort(index)} key={index}>
                        <HeadItemContainer>
                            <span>{item}</span>

                            {sort !== null && paginateData === null && (
                                <ChevronContainer>
                                    <ChevronIcon
                                        opacityIcon={sort[index] !== null && sort[index] === "asc"}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                            clipRule="evenodd"
                                        />
                                    </ChevronIcon>
                                    <ChevronIcon
                                        opacityIcon={sort[index] !== null && sort[index] === "desc"}
                                        position={"bottom"}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                            clipRule="evenodd"
                                        />
                                    </ChevronIcon>
                                </ChevronContainer>
                            )}
                        </HeadItemContainer>
                    </HeadItem>
                ))}
            </tr>
        </Container>
    );
};

export default TableHead;

const Container = styled.thead.attrs(() => ({
    className: ""
}))``;

const HeadItem = styled.th.attrs(props => ({
    className: `px-4 py-2 font-semibold tracking-wider cursor-pointer text-${
        ["left", "center", "right"].includes(props.position) ? props.position : "left"
    } text-gray-600`
}))``;

const HeadItemContainer = styled.div.attrs(() => ({
    className: "flex items-center justify-between w-full"
}))``;

const ChevronContainer = styled.div.attrs(() => ({
    className: "flex flex-col"
}))``;

const ChevronIcon = styled.svg.attrs(props => ({
    className: `w-3 h-3 text-gray-500 ${props.opacityIcon ? "text-opacity-30" : ""} 
    ${props.position === "bottom" ? "transform rotate-180" : ""}`
}))``;
