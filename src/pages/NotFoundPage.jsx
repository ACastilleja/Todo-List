import { Link } from "react-router";

function NotFoundPage(){

return(
    <div className="notfound-container" style={{padding:"4rem 2rem",textAlign:"center"}}>
        <h1 style={{fontSize:"4rem",margin:"0",color:"#e74c3c"}}>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p style={{color:"#000",marginBottom:"2rem"}}>
            The link you followed might be broken, or the page may have been remove.
        </p>

        <div style={{display:"flex",gap:"1.5rem",justifyContent:"center"}}>
            <Link to="/todos" style={linkButtonStyle}>
            Go to My Todos
            </Link>
            <Link to="/about" style={{...linkButtonStyle,backgroundColor:"#7f8c8d"}}>
            Learn About the App 
            </Link>
        </div>
    </div>
);
}
const linkButtonStyle={
    display:"inline-block",
    padding:"0.75rem 1.5rem",
    backgroundColor:"#3498db",
    color:"#ffff",
    textDecoration:"none",
    borderRadius:"5px",
    fontWeight:"bold"
};

export default NotFoundPage;