import { useAuth } from "../contexts/AuthContext";
import Logoff from "../features/Logoff";
import Navigation from "./Navigation";

function Header () {

    const {isAuthenticated, email}=useAuth();
    return (
        <header style={{padding:'10px',borderBottom:'1px solid #ccc'}}>
            <h1>Todo List</h1>
            <Navigation/>
            {isAuthenticated && (
                <div className="user-profile">
                    <span>Welcome, {email}!</span>
                    <br></br>
                    <Logoff/>
                </div>
            )}
        </header>
            
    );
};
export default Header;