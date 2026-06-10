import React from "react";

function AboutPage(){
return (
    <div className="about-container" style={{padding: "2rem", maxWidth:"800px", margin:" 0 auto"}}>
        <h1>About The Todo Application</h1>
        <p>
            Welcome to my Todo App. This app is created to help you keep track of your daily Todo chores. 
        </p>
        <hr style={{margin:"2rem 0", borderColor:"#ececec"}}/>
        <h2>
            Key App Features
        </h2>
        <ul style={{lineHeight:"1.8", paddingLeft:"1.5rem"}}>
            <li><strong>Secure Authentication</strong>Protected route to your personal Todo List.</li>
            <li><strong>Dynamic Filtering</strong>Sort and filter task by <em>All</em>,<em>Active</em>, or <em>Completed</em>statuses.</li>
            <li><strong>Fluid Navigation</strong>Seamless and fast single-page application navigation.</li>
        </ul>
    <hr style={{margin:"2em 0",borderColor:"#ececec"}}/>

    <h2>Technologies Used</h2>
    <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap", marginTop:"1rem"}}>
        <div style={techCardStyle}>
            <h3>React</h3>
            <p>Powers the dynamic UI components, state management via hooks, and optimized list rendering.</p>

        </div>
        <div style={techCardStyle}>
            <h3>React Router</h3>
            <p>Handles client-side routing, protected navigation history guards, and URL search paramenters.</p>

        </div>
        <div style={techCardStyle}>
            <h3>Vite</h3>
            <p>Provides and ultra-fast local developemtn server and optimized production build environment.</p>

        </div>
    </div>

</div>
);

}
const techCardStyle={
    flex: "1 1 200px",
    padding:"1rem",
    border:"1px solid #ddd",
    borderRadius:"8px",
    backgroundColor:"#f9f9f9"
};

export default AboutPage;