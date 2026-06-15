import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { useState } from "react";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import styles from "./TodoListItem.module.css";

function TodoListItem({todo, onCompleteTodo,onUpdateTodo,onDeleteTodo}){
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
                <TextInputWithLabel value={workingTitle} onChange={handleEdit} maxLength="100"/>
                </div>
                <button type="button" className={`${styles.btn} ${styles.cancelBtn}`}onClick={handleCancel}>Cancel</button> 
                <button type="button" className={`${styles.btn} ${styles.updateBtn}`}onClick={handleUpdate} disabled={!isValidTodoTitle(workingTitle)}>Update</button> 
                
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
                <button type="button" className={styles.deleteBtn} onClick={()=>onDeleteTodo(todo.id)} title="Delete Task">🗑️</button>
                </div>
            )}
            
        </form>
    </li>  
    );
}
export default TodoListItem;