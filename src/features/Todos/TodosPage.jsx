import { useState, useEffect } from 'react'
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from "../../shared/SortBy";
import useDebounce from '../../utils/useDebounce';
import FilterInput from '../../shared/FilterInput';

function TodosPage({token}) {
    const [todoList, setTodoList]=useState([]);
    const [error, setError]=useState("");
    const [isTodoListLoading, setIsTodoListLoading]=useState(false);
    const [sortBy, setSortBy]=useState('creationDate');
    const [sortDirection, setSortDirection]=useState('desc');
    const [filterTerm, setFilterTerm]=useState('');
    const debouncedFilterTerm = useDebounce(filterTerm, 300);
    const [dataVersion, setDataVersion]=useState(0);

    const handleFilterChange = (newTerm)=>{setFilterTerm(newTerm);};

    useEffect(()=>{
        if (!token) return;

        async function fetchTodos(){
            try {
                setIsTodoListLoading(true);
                setError("");

                const paramsObject={
                    sortBy,
                    sortDirection
                };

                if (debouncedFilterTerm){
                    paramsObject.find=debouncedFilterTerm;
                }

                const params =  new URLSearchParams(paramsObject);

                const response = await fetch(`/api/tasks?${params}`,{
                    method: 'GET',
                    headers:{'X-CSRF-TOKEN':token,},
                    credentials:'include'
                });

                if (response.status === 401){
                    throw new Error('Unauthorized access. Please log in again.');
                }
                if (!response.ok){
                    throw new Error('Failed to fetch todos.');
                }

                const data = await response.json();
                setTodoList(data.tasks);
                //setFilterError('');

            }catch(err) {
                setError(err.message);
            }finally {
                setIsTodoListLoading(false);
            }
        }
        fetchTodos();
    },[token,setIsTodoListLoading,setTodoList,setError, sortBy,sortDirection,debouncedFilterTerm]);

    const addTodo = async (todoTitle)=>{
    
    const tempId = Date.now().toString();
    const newTodo = {id:tempId, title: todoTitle, isCompleted: false };
    setTodoList((previous=>[newTodo,...previous]));

    try{
        const response = await fetch('/api/tasks',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRF-TOKEN':token
            },
            credentials:'include',
            body: JSON.stringify({title: todoTitle, isCompleted: false})
        });
        if(!response.ok) throw new Error('Could not save your todo.');
        const serverData = await response.json();
        setTodoList((previous)=>
        previous.map((todo)=>(todo.id===tempId ? serverData : todo))
        );
    }catch(err){
        setError(`Failed to add todo: ${err.message}`);
        setTodoList((previous)=>previous.filter((todo)=>todo.id !==tempId));
    }

};

    const completeTodo = async (id)=>{
    const originalTodo = todoList.find((todo)=>todo.id === id);
    if(!originalTodo) return;

    setTodoList((previous)=>previous.map((todo)=>todo.id===id ? {...todo,isCompleted:!todo.isCompleted}:todo));
    
    try {
        const response = await fetch(`/api/tasks/${id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
                'X-CSRF-TOKEN':token
            },
            credentials:'include',
            body: JSON.stringify({
                isCompleted: !originalTodo.isCompleted
            }),
        });
        if(!response.ok)throw new Error('Could not update task status.');
    }catch(err){
        setError(`Failed to update status: ${err.message}`);
        setTodoList((previous)=>previous.map((todo)=>(todo.id === id ? originalTodo:todo)));
    }
};
    const updateTodo = async (editedTodo)=>{
    const originalTodo = todoList.find((todo)=>todo.id === editedTodo.id);
    if(!originalTodo)return;


    setTodoList((previous)=>previous.map((todo)=>(todo.id === editedTodo.id ? editedTodo:todo)));

    try{
        const response = await fetch(`/api/tasks/${editedTodo.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
                'X-CSRF-TOKEN':token
            },
            credentials:'include',
            body: JSON.stringify({
                title: editedTodo.title,
                isCompleted: editedTodo.isCompleted,
            }),
        });
        if (!response.ok)throw new Error('Could not update todo title.');
} catch (err){
    setError(`Failed to save edit: ${err.message}`);
    setTodoList((previous)=>
    previous.map((todo)=>(todo.id===editedTodo.id ? originalTodo : todo))
    );
}
};

    return (
    <div>
    <h1>My Todos</h1>
    {error && (
        <div className="error-banner" style={{color:'red', marginBottom: '15px'}}>
            <p>{error}</p>
            <button onClick={()=>setError("")}>Clear Error</button>
        </div>
    )}
    {isTodoListLoading && <p>Loading your todo list...</p>}
    <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy} onSortDirectionChange={setSortDirection}/>
    <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
    <TodoForm onAddTodo={addTodo}/>
    <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>

    </div>
);
};

export default TodosPage;
