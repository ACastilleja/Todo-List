import { useEffect, useReducer } from 'react'
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from "../../shared/SortBy";
import useDebounce from '../../utils/useDebounce';
import FilterInput from '../../shared/FilterInput';
import { todoReducer,initialTodoState,TODO_ACTIONS } from '../../reducers/todoReducer';
import { useAuth } from '../../contexts/AuthContext';


function TodosPage() {

    const {token}=useAuth();
    
    const [state, dispatch]=useReducer(todoReducer, initialTodoState);
    const{
        todoList,
        error,
        filterError,
        isTodoListLoading,
        sortBy,
        sortDirection,
        filterTerm,
        dataVersion,
    }=state;

    const debouncedFilterTerm = useDebounce(filterTerm, 300);


    

    useEffect(()=>{
        if (!token) return;

        async function fetchTodos(){
            try {
                dispatch({type:TODO_ACTIONS.FETCH_START});

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
                dispatch({
                    type: TODO_ACTIONS.FETCH_SUCCESS,
                    payload: {todos:data.tasks}
                });

            }catch(error) {
                const isFilterErr = debouncedFilterTerm||sortBy !=='createdDate'|| sortDirection !=='desc';
                
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {
                        message: isFilterErr 
                        ? `Error filtering/sorting todos: ${error.message}`
                        : `Error fetching todos: ${error.message}`,
                        isFilterError: isFilterErr
                    }
                });
            }
            
        }
        fetchTodos();
    },[token,sortBy,sortDirection,debouncedFilterTerm]);

    const addTodo = async (todoTitle)=>{
    
    const rollbackList = todoList;    
    const tempId = Date.now().toString();
    const newTodo = {id:tempId, title: todoTitle, isCompleted: false };
    dispatch({
        type: TODO_ACTIONS.ADD_TODO_START,
        payload:{newTodo}
    });

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
        const confirmedTodo = await response.json();
        dispatch({
            type: TODO_ACTIONS.ADD_TODO_SUCCESS,
            payload:{tmpId: tempId, confirmedTodo}
        });
        dispatch({type:TODO_ACTIONS.INCREMENT_VERSION});
        

    }catch(err){
        dispatch({
            type: TODO_ACTIONS.ADD_TODO_ERROR,
            payload:{message:`Failed to add todo: ${err.message}`,rollbackList}
        });
    }

    };

    const completeTodo = async (id)=>{
    const rollbackList=todoList;
    const originalTodo = todoList.find((todo)=>todo.id === id);
    if(!originalTodo) return;

    dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_START,
        payload: {id}
    });
    
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
        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
            payload:{confirmedTodo:{...originalTodo,isCompleted:!originalTodo.isCompleted}}
        });

    }catch(err){
        dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
            payload:{message: `Failed to update status: ${err.message}`,rollbackList}
        });
    }
};
    const updateTodo = async (editedTodo)=>{
    const rollbackList=todoList;
    const originalTodo = todoList.find((todo)=>todo.id === editedTodo.id);
    if(!originalTodo)return;


    dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_START,
        payload:{id:editedTodo.id, title: editedTodo.title}
    });

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
        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
            payload:{confirmedTodo:editedTodo}
        });

} catch (err){
    dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {message:`Failed to save edit: ${err.message}`,rollbackList}
    });
}
};


    return (
    <div>
    <h1>My Todos</h1>
    {error && (
        <div className="error-banner" style={{color:'red', marginBottom: '15px'}}>
            <p>{error}</p>
            <button onClick={()=>dispatch({type: TODO_ACTIONS.CLEAR_ERROR})}>Clear Error</button>
        </div>
    )}
    {filterError && (
        <div className='filter-error-banner' style={{color:'orange', marginBottom:'15px' }}>
            <p>{filterError}</p>
            <button onClick={()=>dispatch({type:TODO_ACTIONS.CLEAR_FILTER_ERROR})}>Clear Filter Error</button>
            <button onClick={()=>dispatch({type: TODO_ACTIONS.RESET_FILTERS})}>Reset Filters</button>
        </div>
    )}
    {isTodoListLoading && <p>Loading your todo list...</p>}
    <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={(newSort)=>dispatch({type: TODO_ACTIONS.SET_SORT, payload:{sortBy:newSort,sortDirection}})} 
    onSortDirectionChange={(newDir)=>dispatch({type: TODO_ACTIONS.SET_SORT,payload:{sortBy,sortDirection:newDir}})}/>
    <FilterInput filterTerm={filterTerm} onFilterChange={(text)=>dispatch({type: TODO_ACTIONS.SET_FILTER,payload:{filterTerm:text}})} />
    <TodoForm onAddTodo={addTodo}/>
    <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} dataVersion={dataVersion} />

    </div>
);
};

export default TodosPage;
