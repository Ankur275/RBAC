import React, { useState, useEffect } from "react";
import  apiClient  from "../api/axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

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
        <>
        <div>
            <h1>User Dashboard</h1>
            {message ? <p>{message}</p> : <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="flexGrow">
                <button onClick={goBack}>Go Back</button>
            </div>
        </div>
        </>
    );
};

export default UserDashboard;
