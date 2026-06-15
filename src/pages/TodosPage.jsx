import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter';
import { useEffect, useReducer } from 'react'
import TodoList from '../features/Todos/TodoList/TodoList';
import TodoForm from '../features/Todos/TodoForm';
import SortBy from "../shared/SortBy";
import useDebounce from '../utils/useDebounce';
import FilterInput from '../shared/FilterInput';
import { todoReducer,initialTodoState,TODO_ACTIONS } from '../reducers/todoReducer';
import { useAuth } from '../contexts/AuthContext';
import styles from './TodoDashboard.module.css';
import DOMPurify from 'dompurify';
import { isValidTodoTitle } from '../utils/todoValidation';

function TodosPage() {

    const {token}=useAuth();
    const[searchParams]=useSearchParams();
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
    const statusFilter=searchParams.get('status')||'all';

    

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
// verifying length before DOMPurify
    const rawTitle=todoTitle ? todoTitle.trim():'';
    if(!isValidTodoTitle(rawTitle)||rawTitle.length>100){
        dispatch({
            type:TODO_ACTIONS.ADD_TODO_ERROR,
            payload:{message:"Invalid task title. Title must be between 1 and 100 characters.",rollbackList:todoList}
        });
        return;
    }
// DOMPurify    
    const sanitizedTitle = DOMPurify.sanitize(rawTitle);
    if(!sanitizedTitle)return;

    const rollbackList = todoList;    
    const tempId = Date.now().toString();
    const newTodo = {id:tempId, title: sanitizedTitle, isCompleted: false };
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
            body: JSON.stringify({title: sanitizedTitle, isCompleted: false})
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
  // Validate length
    const rawTitle=editedTodo.title?editedTodo.title.trim():'';
    if (!isValidTodoTitle(rawTitle)||rawTitle.length>100){
        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_ERROR,
            payload:{message:"Invalid task title. Title must be between 1 and 100 characters.",rollbackList: todoList}
        });
        return;
    }
    // DOMPurify
    const sanitizedTitle=DOMPurify.sanitize(rawTitle);
    if(!sanitizedTitle)return;

    const rollbackList=todoList;
    const originalTodo = todoList.find((todo)=>todo.id === editedTodo.id);
    if(!originalTodo)return;

    const secureTodo={...editedTodo, title:sanitizedTitle};


    dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_START,
        payload:{id:secureTodo.id, title: secureTodo.title}
    });

    try{
        const response = await fetch(`/api/tasks/${secureTodo.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
                'X-CSRF-TOKEN':token
            },
            credentials:'include',
            body: JSON.stringify({
                title: secureTodo.title,
                isCompleted: secureTodo.isCompleted,
            }),
        });
        if (!response.ok)throw new Error('Could not update todo title.');
        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
            payload:{confirmedTodo:secureTodo}
        });

} catch (err){
    dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {message:`Failed to save edit: ${err.message}`,rollbackList}
    });
}
};
    const deleteTodo = async(id)=>{
        const rollbackList=todoList;

        dispatch({
            type: TODO_ACTIONS.DELETE_TODO_START,
            payload:{id}
        });
        try {
            const response = await fetch(`/api/tasks/${id}`,{
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN':token
                },
                credentials:'include'
            });
            if(!response.ok) throw new Error('Could not delete task from server.');

            dispatch({type: TODO_ACTIONS.DELETE_TODO_SUCCESS, payload:{id}});
            dispatch({type: TODO_ACTIONS.INCREMENT_VERSION});
        }catch(err){
            dispatch({
                type: TODO_ACTIONS.DELETE_TODO_ERROR,
                payload:{message:`Failed to delete todo: ${err.message}`,rollbackList},
                
            });
        }
    };


    return (
    <div className={styles.dashboardContainer}>
    <div className={styles.contentCard}>
    <h1 className={styles.sectionTitle}>My Todos Dashboard</h1>
    {/* Error Banners */}
    {error && (
        <div className={styles.errorBanner}>
            <p>{error}</p>
            <button onClick={()=>dispatch({type: TODO_ACTIONS.CLEAR_ERROR})}>Clear Error</button>
        </div>
    )}
    {filterError && (
        <div className={styles.fiterErrorBanner}>
            <p>{filterError}</p>
            <div className={styles.bannerButtons}>
            <button onClick={()=>dispatch({type:TODO_ACTIONS.CLEAR_FILTER_ERROR})}>Clear Filter Error</button>
            <button onClick={()=>dispatch({type: TODO_ACTIONS.RESET_FILTERS})}>Reset Filters</button>
            </div>
        </div>
    )}
    {/* Form */}
    <div className={styles.formSection}>
        <TodoForm onAddTodo={addTodo}/>
    </div>

    {/* Filter */}
    <div className={styles.filterSection}>
    <FilterInput filterTerm={filterTerm} onFilterChange={(text)=>dispatch({type: TODO_ACTIONS.SET_FILTER,payload:{filterTerm:text}})} /> 
    <StatusFilter/>
    <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={(newSort)=>dispatch({type: TODO_ACTIONS.SET_SORT, payload:{sortBy:newSort,sortDirection}})} 
    onSortDirectionChange={(newDir)=>dispatch({type: TODO_ACTIONS.SET_SORT,payload:{sortBy,sortDirection:newDir}})}/>
    </div>

    {/* List */}

    {isTodoListLoading ? (
        <p className={styles.loadingText}>🔄Loading your todo list...</p>
    ) : todoList.length === 0 ? (
        <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🎯</span>
            <p>All caught up! Add a task above to start your day.</p>
        </div>
    ):(
        <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} onDeleteTodo={deleteTodo} dataVersion={dataVersion} statusFilter={statusFilter}/>
    )}
    </div>
    </div>
);
};

export default TodosPage;
