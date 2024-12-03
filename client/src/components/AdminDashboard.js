import React, { useState, useEffect } from "react";
import  apiClient  from "../api/axios";

const AdminDashboard = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiClient.get("api/users/admin-dashboard");
                setMessage(data.data.message);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {message ? <p>{message}</p> : <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default AdminDashboard;
