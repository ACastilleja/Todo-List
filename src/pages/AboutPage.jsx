import React from "react";
import styles from "./TodoDashboard.module.css";

function AboutPage(){
return (
    <div className={styles.dashboardContainer}>
    <div className={styles.contentCard} style={{ maxWidth:"800px"}}>
        <h1 classsName={styles.sectionTitle}>About My Todo Application</h1>
        <p styles={{fontFamily:"sans-serif",color:"#4a5568", lineHeight:"1.6"}}>
            Welcome to my Todo App. This app was created to help you keep track of your daily Todo chores. 
        </p>
        <hr style={{margin:"2rem 0", borderColor:"#e2e8f0"}}/>
        <h2 style={{fontFamily:"sans-serif", color:"#1e293b",marginBottom:"1rem"}}>
            Key App Features
        </h2>
        <ul style={{fontFamily:"sans-serif",color:"#4a5568", lineHeight:"1.8", paddingLeft:"1.5rem", marginBottom:"2rem"}}>
            <li><strong>Secure Authentication: </strong>Protected route to your personal Todo List.</li>
            <li><strong>Dynamic Filtering: </strong>Sort and filter task by <em>All</em>, <em>Active</em>, or <em>Completed</em> statuses.</li>
            <li><strong>Profile Analytics: </strong>Real-time statistics track your completion percentage and active task counts on a dedicated profile dashboad.</li>
            <li><strong>Fluid Navigation: </strong>Seamless and fast single-page application navigation.</li>
        </ul>
    <hr style={{margin:"2em 0",borderColor:"#e2e8f0"}}/>

    <h2 style={{fontFamily:"sans-serif",color:"1e293b",marginBottom:"1rem" }}>Technologies Used</h2>
    <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap", marginTop:"1rem"}}>
        <div style={techCardStyle}>
            <h3 style={{margin:"0 0 0.5rem 0",color:"#2d3748"}}>React</h3>
            <p style={{margin:0, fontSize:"0.9rem", color: "#4a5568"}}>Powers the dynamic UI components, state management via hooks, and optimized list rendering.</p>

        </div>
        <div style={techCardStyle}>
            <h3 style={{margin:"0 0 0.5rem 0",color:"#2d3748"}}>React Router</h3>
            <p style={{margin:0, fontSize:"0.9rem", color: "#4a5568"}}>Handles client-side routing, protected navigation history guards, and URL search paramenters.</p>

        </div>
        <div style={techCardStyle}>
            <h3 style={{margin:"0 0 0.5rem 0",color:"#2d3748"}}>Vite</h3>
            <p style={{margin:0, fontSize:"0.9rem", color: "#4a5568"}}>Provides and ultra-fast local development server and optimized production build environment.</p>

        </div>
    </div>
    </div>
</div>
);

}
const techCardStyle={
    flex: "1 1 200px",
    padding:"1.25rem",
    border:"1px solid #adb2b9",
    borderRadius:"8px",
    backgroundColor: "#f8fafc",
    fontFamily:"sans-serif"
};

export default AboutPage;