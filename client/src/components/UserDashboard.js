import React, { useState, useEffect } from "react";
import  apiClient  from "../api/axios";

const UserDashboard = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiClient.get("api/users/user-dashboard");
                setMessage(data.data.message);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>User Dashboard</h1>
            {message ? <p>{message}</p> : <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default UserDashboard;
