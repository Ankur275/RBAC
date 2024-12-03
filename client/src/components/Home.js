import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import apiClient from "../api/axios";

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await apiClient.post("api/users/logout",{},{withCredentials: true});
            setAuth(null); // Clear auth state
            navigate("/linkpage"); // Redirect to login
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in!</p>
            <br />
            <Link to="/moderator">Go to the Moderator page</Link>
            <br />
            <Link to="/admin">Go to the Admin page</Link>
            <br />
            <Link to="/lounge">Go to the Lounge</Link>
            <br />
            <Link to="/admin-dashboard">Admin-Dashboard</Link>
            <br />
            <Link to="/moderator-dashboard">Modreator-Dashboard</Link>
            <br />
            <Link to="/user-dashboard">User-Dashboard</Link>
            <br />
            <Link to="/linkpage">Go to the link page</Link>
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home