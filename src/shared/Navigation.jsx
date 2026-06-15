import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Header.module.css";

function Navigation (){
    const {isAuthenticated}=useAuth();

    const getLinkClass=({isActive})=>
        isActive ? `${styles.navLink} ${styles.activeNavLink}`:styles.navLink;
    

    return(
        <nav>
            <ul className={styles.navList}>
                <li>
                    <NavLink to="/about" className={getLinkClass}>
                    About
                    </NavLink>
                </li>
                {isAuthenticated && (
                    <>
                        <li>
                            <NavLink to="/todos" className={getLinkClass}>
                            Todos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" className={getLinkClass}>
                            Profile
                            </NavLink>
                        </li>
                    </>
                )}
                {!isAuthenticated && (
                    <li>
                        <NavLink to="/login" className={getLinkClass}>
                        Login
                        </NavLink>
                    </li>
                )}

            </ul>
        </nav>
    );
}
export default Navigation;


