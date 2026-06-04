import { useAuth } from "../contexts/AuthContext";
import Logoff from "../features/Logoff";

function Header () {

    const {isAuthenticated, email}=useAuth();
    return (
        <header style={{padding:'10px',borderBottom:'1px solid #ccc'}}>
            <h1>Todo List</h1>
            {isAuthenticated && (
                <div className="user-profile">
                    <span>Welcome, {email}!</span>
                    <Logoff/>
                </div>
            )}
        </header>
            
    );
};
export default Header;