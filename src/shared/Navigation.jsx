import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function Navigation (){
    const {isAuthenticated}=useAuth();

    const navLinkStyle=({isActive})=>{
        return{
            fontWeight: isActive ? "bold":"normal",
            textDecoration: isActive?"underline":"none",
            color: isActive ? "#3498db": "#333",
        };
    };

    const listStyle ={
        listStyle:'none',
        display:'flex',
        gap:'1rem',
        padding:0,
        margin:0
    };

    return(
        <nav>
            <ul style={listStyle}>
                <li>
                    <NavLink to="/about" style={navLinkStyle}>
                    About
                    </NavLink>
                </li>
                {isAuthenticated && (
                    <>
                        <li>
                            <NavLink to="/todos" style={navLinkStyle}>
                            Todos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" style={navLinkStyle}>
                            Profile
                            </NavLink>
                        </li>
                    </>
                )}
                {!isAuthenticated && (
                    <li>
                        <NavLink to="/login" style={navLinkStyle}>
                        Login
                        </NavLink>
                    </li>
                )}

            </ul>
        </nav>
    );
}
export default Navigation;


