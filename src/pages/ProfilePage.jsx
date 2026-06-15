import { useState,useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from './TodoDashboard.module.css';

function ProfilePage(){
    const {token,email}=useAuth();
    const [todoStats,setTodoStats]=useState({total:0,completed:0,active:0});
    const [loading, setLoading]=useState(true);
    const [error,setError]=useState("");

    useEffect(()=>{
        async function fetchTodoStats(){
            if(!token)return;
            try {
                setLoading(true);
                setError("");

                const options ={
                    method:"GET",
                    headers:{"X-CSRF-TOKEN":token},
                    credentials:"include",
                };
                const response = await fetch("/api/tasks",options);

                if(response.status === 401){
                    throw new Error("Unauthorized");
                }
                if(!response.ok){
                    throw new Error("Failed to fetch todos");
                }

                const data = await response.json();

                const tasksArray=Array.isArray(data)?data:(data.tasks||[]);

                const total = tasksArray.length;
                const completed =tasksArray.filter((todo)=>todo.isCompleted).length;
                const active = total - completed;

                setTodoStats({total,completed,active});
            }catch (err){
                setError(`Error loading statistics: ${err.message}`);
            }finally{
                setLoading(false);
            }
        }
        fetchTodoStats();
    },[token]);

    const completionPercentage = todoStats.total>0 ? Math.round((todoStats.completed/todoStats.total)*100):0;

    if(loading) return (
    <div className={styles.dashboardContainer}>
        <p className={styles.loadingText}>🔄Loading your stats...</p>
    </div>);
    if(error) return (<div className={styles.dashboardContainer}>
        <div className={styles.errorBanner} styles={{maxWidth:"600px",width:"100%"}}>
            <p>{error}</p>
        </div>
    </div>);

    return (
        <div className={styles.dashboardContainer}>
        <div className={styles.contentCard} style={{ maxWidth:"600px"}}>
            <h1 className={styles.sectionTitle}>User Profile</h1>
        {/* Account Details Block */}
            <div style={{backgroundColor:"#f8fafc",padding:"1.25rem",borderRadius:"8px", marginBottom:"2rem", border:"1px solid #cbcfd3",fontFamily:"sans-serif",color:"#4a5568"}}>
                <p style={{magin:"0 0 0.5rem 0"}}><strong>Name/Email: </strong>{email||"Productive Developer"}</p>
                <p style={{margin: 0}}><strong>Account Status: </strong><span style={{color:"#38a169",fontWeight:"600"}}>Active</span></p>
            </div>
        {/* Statistics Block */}
            <h2 style={{fontFamily:"sans-serif", color:"#1e293b", fontSize:"1.25rem",marginBottom:"1rem"}}>Your Dashboard Statistics</h2>

            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"1rem",marginTop:"1rem"}}>
                <div style={statCardStyle}>
                    <h3 style={{margin: "0 0 0.25rem 0",fontSize:"1.75rem",color:"#1e293b"}}>{todoStats.total}</h3>
                    <p style={{margin: 0, fontSize:"0.9rem",color:"#64748b",fontWeight:"600"}}>Total Tasks</p>
                </div>
                <div style={statCardStyle}>
                    <h3 style={{margin: "0 0 0.25rem 0",fontSize:"1.75rem",color:"#38a169"}}>{todoStats.completed}</h3>
                    <p style={{margin: 0, fontSize:"0.9rem",color:"#64748b",fontWeight:"600"}}>Completed</p>
                </div>
                <div style={statCardStyle}>
                    <h3 style={{margin: "0 0 0.25rem 0",fontSize:"1.75rem",color:"#dd6b20"}}>{todoStats.active}</h3>
                    <p style={{margin: 0, fontSize:"0.9rem",color:"#64748b",fontWeight:"600"}}>Active</p>
                </div>
            </div>
        {/* Progress Bar */}
            {todoStats.total > 0 && (
                <div style={{marginTop:"2rem",textAlign:"center",fontFamily:"sans-serif"}}>
                    <h3 style={{fontSize: "1.1rem",color:"#1e293b",margin:"0 0 0.75rem 0"}}>Overall Completion Progress</h3>
                    <div style={{background:"#e2e8f0",borderRadius:"10px",height:"16px",width:"100%",overflow:"hidden"}}>
                        <div style={{
                            background:"linear-gradient(90deg, #3182ce 0%,#4299e1 100%)",
                            height:"100%",
                            borderRadius:"10px",
                            width:`${completionPercentage}%`,
                            transition:"width 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}/>
                    </div>
                    <p style={{marginTop:"0.75rem",color:"#4a5568",fontSize:"0.95rem", fontWeight:"500"}}>{completionPercentage}% of tasks finished!</p>
                </div>
            )}
            </div>
        </div>
    );

}

const statCardStyle = {
    border:"1px solid #cbcfd3",
    borderRadius:"8px",
    padding:"1.25rem 1rem",
    textAlign:"center",
    backgroundColor:"#fff",
    fontFamily:"sans-serif",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
};

export default ProfilePage;