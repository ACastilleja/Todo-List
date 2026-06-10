import { useState,useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage(){
    const {token,user}=useAuth();
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
                setError(`Error loading statistics:${err.message}`);
            }finally{
                setLoading(false);
            }
        }
        fetchTodoStats();
    },[token]);

    const completionPercentage = todoStats.total>0 ? Math.round((todoStats.completed/todoStats.total)*100):0;

    if(loading) return <div style={{padding:"2rem",textAlign:"center"}}>Laoding your stats...</div>;
    if(error) return <div style={{padding:"2rem", color:"red"}}>{error}</div>;

    return (
        <div className="profile-container" style={{padding:"2rem", maxWidth:"600px",margin:"0 auto"}}>
            <h1>User Profile</h1>
            <div style={{backgroundColor:"#f9f9f9",padding:"1.5rem",borderRadius:"8px", marginBottom:"2rem"}}>
                <p><strong>Name:</strong>{user?.name||"Productive Developer"}</p>
                <p><strong>Account Status:</strong>Active</p>
            </div>

            <h2>Your Dashboard Statistics</h2>
            <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",marginTop:"1rem"}}>
                <div style={statCardStyle}>
                    <h3>{todoStats.total}</h3>
                    <p>Total Tasks</p>
                </div>
                <div style={statCardStyle}>
                    <h3 style={{color:"green"}}>{todoStats.completed}</h3>
                    <p>Completed</p>
                </div>
                <div style={statCardStyle}>
                    <h3 style={{color: "#e67e22"}}>{todoStats.active}</h3>
                    <p>Active</p>
                </div>
            </div>
            {todoStats.total > 0 && (
                <div style={{marginTop:"2rem",textAlign:"center"}}>
                    <h3>Overall Completion Progress</h3>
                    <div style={{background:"#eee",borderRadius:"10px",height:"20px",width:"100%",marginTop:"0.5rem"}}>
                        <div style={{
                            background:"green",
                            height:"100%",
                            borderRadius:"10px",
                            width:`${completionPercentage}%`,
                            transition:"width 0.5s ease"
                        }}/>
                    </div>
                    <p style={{marginTop:"0.5rem"}}>{completionPercentage}% of tasks finished!</p>
                </div>
            )}

        </div>
    );

}

const statCardStyle = {
    border:"1px solid #ddd",
    borderRadius:"8px",
    padding:"1rem",
    textAlign:"center",
    backgroundColor:"#fff"
};

export default ProfilePage;