import { useRef, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";
import styles from './TodoForm.module.css';

function TodoForm({onAddTodo}){
    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle]=useState('');

    const handleAddTodo = (event)=>{
        event.preventDefault();

        
        if(workingTodoTitle.trim() !==""){
            onAddTodo(workingTodoTitle);
            setWorkingTodoTitle('');
            inputRef.current.focus();
        }
    };
    return(
        <form onSubmit={handleAddTodo} className={styles.formContainer}>
            <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
            <TextInputWithLabel 
            innerRef={inputRef} 
            value={workingTodoTitle} 
            onChange={(e)=>setWorkingTodoTitle(e.target.value)}
            elementId={"todoTitle"}
            labelText={"Todo "}
            />
            </div>
            <button type="submit" className={styles.submitButton} disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>

            </div>           
            
        </form>
    );
}
export default TodoForm;