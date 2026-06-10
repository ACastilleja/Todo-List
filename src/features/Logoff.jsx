import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

function Logoff(){
    const {logout} = useAuth();
    const navigate = useNavigate();


    const[logoutError, setLogoutError]=useState('');
    const[isLoggingOff, setIsLoggingOff]=useState(false);

    const handleLogoutClick = async ()=>{
        setIsLoggingOff(true);
        setLogoutError('');

        const result = await logout();

        if(result.success){
            navigate('/login');
        }else {
            setLogoutError(result.error);
            setIsLoggingOff(false);
        }

    };
    return (
        <div className="logout-container" style={{display:'inline-block' }}>
            <button
            onClick={handleLogoutClick}
            disabled={isLoggingOff}
            className="logout-button"
            >{isLoggingOff ? 'Logging out ...':'Log Out'}</button>

            {logoutError && (
                <p className="error-message" style={{ color:'red',margin:'5px 0 0 0'}}>
                    {logoutError}
                </p>
            )}
        </div>
    );
}
export default Logoff