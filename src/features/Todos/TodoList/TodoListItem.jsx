import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { useState } from "react";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import styles from "./TodoListItem.module.css";

function TodoListItem({todo, onCompleteTodo,onUpdateTodo}){
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);
    
    const handleCancel = ()=>{
        setWorkingTitle(todo.title);
        setIsEditing(false);
    };
    const handleEdit = (event)=>{
        setWorkingTitle(event.target.value);
    };
    const handleUpdate = (event)=>{
        if (!isEditing) return;
        event.preventDefault();
        onUpdateTodo({
            ...todo,title:workingTitle
        });
        setIsEditing(false);
    };


        return(
    <li className={styles.itemCard}>
        <form onSubmit={handleUpdate} className={styles.itemForm}>
            {isEditing ?(
                <div className={styles.editContainer}>
                <div className={styles.editInputWrapper}>
                <TextInputWithLabel value={workingTitle} onChange={handleEdit}/>
                </div>
                <button type="button" onClick={handleCancel}>Cancel</button> 
                <button type="button" onClick={handleUpdate} disabled={!isValidTodoTitle(workingTitle)}>Update</button> 
                
                </div>
                ):(
                <div className={styles.viewContainer}>
                
                <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={todo.isCompleted}
                    onChange={()=>onCompleteTodo(todo.id)}
                />
                
                <span className={`${styles.todoText} ${todo.isCompleted ? styles.completedText : ""}`}
                onClick = {()=>setIsEditing(true)}>{todo.title}
                </span>
                </div>
            )}
            
        </form>
    </li>  
    );
}
export default TodoListItem;