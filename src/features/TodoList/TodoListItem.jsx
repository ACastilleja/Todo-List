import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { useState } from "react";


function TodoListItem({todo, onCompleteTodo}){
    const [isEditing, setIsEditing] = useState(false);

        return(
    <li>
        <form>
            {isEditing ?(<TextInputWithLabel value={todo.title}/>):(
                <>
                <label>
                <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={()=>onCompleteTodo(todo.id)}
                />
                </label>
                <span onClick = {()=>setIsEditing(true)}>{todo.title}</span>
                </>
            )}

        </form>
    </li>  
    );
}
export default TodoListItem;