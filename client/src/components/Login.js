import { useRef, useState, useEffect } from 'react';
import { jwtDecode}  from 'jwt-decode';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../api/axios';

const LOGIN_URL = '/api/users/login';

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await apiClient.post(
                LOGIN_URL,
                { email, password: pwd },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
    
            // console.log("Server Response:", response.data);
    
            const accessToken = response.data.data.accessToken; // Fix
            // console.log(accessToken);
            const decoded = jwtDecode(accessToken); // Decode the token
            // console.log("decoded:", decoded);
    
            const roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role]; // Extract roles
            // console.log("roles:", roles);
            const username = decoded?.username; // Extract username
            // console.log("username:", username);
            localStorage.setItem("accessToken", response.data.data.accessToken);
            setAuth({ email: decoded.email, roles, username, accessToken }); // Set auth state
            setEmail('');
            setPwd('');
            navigate(from, { replace: true }); // Redirect
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            if (errRef.current) {
                errRef.current.focus(); // Safely call focus on errRef
            }
        }
    };
    

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" tabIndex =" -1">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>
    );
};

export default Login;
