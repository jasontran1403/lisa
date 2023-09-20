import Axios from "axios";
import React, { useState, useEffect } from "react";

import env from "../helpers/env";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            let config = {
                method: "get",
                url: `${env}/api/user/${value}`
            };

            if (value !== "") {
                Axios(config).then(response => {
                    setDebouncedValue(response.data.name);
                });
            }
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
