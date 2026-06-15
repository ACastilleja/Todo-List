import {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

function LoginPage(){
    const {login, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [isLoggingOn, setIsLoggingOn] = useState(false);
    const[showPassword, setShowPassword]=useState(false);

    const from = location.state?.from?.pathname || '/todos';

    useEffect(()=>{
        if(isAuthenticated){
            navigate(from, {replace:true});
        }
    },[isAuthenticated,navigate,from]);



    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoggingOn(true);
        setAuthError("");


        const result = await login(email,password);

        if (!result.success){
            setAuthError(result.error);
            setIsLoggingOn(false);
        }
    };

    const togglePasswordVisibility=()=>{
        setShowPassword((prevState)=>!prevState);
    };
    
    return(
        <div className={styles.loginContainer}>
            {authError&&<p className="error-message" style={{color:'red'}}>{authError}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address:</label>
                    <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <div className={styles.passwordWrapper}>
                    <input
                    id="password"
                    type={showPassword?"text":"password"}
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}/>
                    <button 
                        type="button"
                        className={styles.eyeButton}
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword?"Hide password":"Show password"}>
                            {showPassword?"🙈":"👁️"}
                        </button>

                    </div>
                    
                </div>

                <button type="submit" disabled={isLoggingOn}>
                    {isLoggingOn?"Logging in...":"Log On"}
                </button>
            </form>
        </div>
    );

}
export default LoginPage;