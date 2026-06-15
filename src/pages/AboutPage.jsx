import React from "react";
import styles from "./AboutPage.module.css";

function AboutPage(){
return (
    <div className={styles.aboutContainer}>
    <div className={styles.aboutCard} style={{ maxWidth:"800px"}}>
        <h1 className={styles.aboutTitle}>About My Todo Application</h1>
        <p className={styles.aboutText}>
            Welcome to my Todo App. This app was created to help you keep track of your daily Todo chores. 
        </p>
        <hr className={styles.divider}/>
        <h2 className={styles.subTitle}>
            Key App Features
        </h2>
        <ul className={styles.featureList}>
            <li><strong>Secure Authentication: </strong>Protected route to your personal Todo List.</li>
            <li><strong>Dynamic Filtering: </strong>Sort and filter task by <em>All</em>, <em>Active</em>, or <em>Completed</em> statuses.</li>
            <li><strong>Profile Analytics: </strong>Real-time statistics track your completion percentage and active task counts on a dedicated profile dashboad.</li>
            <li><strong>Fluid Navigation: </strong>Seamless and fast single-page application navigation.</li>
        </ul>
    <hr className={styles.divider}/>

    <h2 className={styles.subTitle}>Technologies Used</h2>
    <div className={styles.techGrid}>
        <div className={styles.techCard}>
            <h3 className={styles.techCardTitle}>React</h3>
            <p className={styles.techCardText}>Powers the dynamic UI components, state management via hooks, and optimized list rendering.</p>

        </div>
        <div className={styles.techCard}>
            <h3 className={styles.techCardTitle}>React Router</h3>
            <p className={styles.techCardText}>Handles client-side routing, protected navigation history guards, and URL search paramenters.</p>

        </div>
        <div className={styles.techCard}>
            <h3 className={styles.techCardTitle}>Vite</h3>
            <p className={styles.techCardText}>Provides and ultra-fast local development server and optimized production build environment.</p>

        </div>
    </div>
    </div>
</div>
);

}


export default AboutPage;