import { useAuth } from "../contexts/AuthContext";
import Logoff from "../features/Logoff";
import Navigation from "./Navigation";
import styles from "./Header.module.css";

function Header () {

    const {isAuthenticated, email}=useAuth();
    return (
        <header className={styles.headerContainer}>
            <h1 className={styles.todoTitle}>Todo List</h1>
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