import { useState, useEffect } from 'react';
import axios from 'axios';

// a modified version of useGet that takes in a dependencies array (such as [loggedIn])
export default function useGetUser(url, initialState = null, dependencies = [], options = {}) {
    const [data, setData] = useState(initialState);
    // const [isLoading, setLoading] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [refreshToggle, setRefreshToggle] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!dependencies[0] || !url || (Array.isArray(dependencies) && dependencies.slice(1).some(dep => !dep))) {
                return;
            }
            setLoading(true);
            const response = await axios.get(url, options);
            setData(response.data);
            setLoading(false);
        }
        fetchData();

        // test isLoading page with increased latency
        // setTimeout(() => fetchData(), 2000);
    }, [url, refreshToggle].concat(dependencies));

    function refresh() {
        setRefreshToggle(!refreshToggle);
    }

    return { data, isLoading, refresh };
}