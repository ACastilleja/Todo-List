export const TODO_ACTIONS = {

    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',

    ADD_TODO_START: 'ADD_TODO_START',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',

    COMPLETE_TODO_START: 'COMPLETE_TODO_START',
    COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
    COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

    UPDATE_TODO_START: 'UPDATE_TODO_START',
    UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
    UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',
    
    SET_SORT: 'SET_SORT',
    SET_FILTER: 'SET_FILTER',
    CLEAR_ERROR: 'CLEAR_ERROR',
    RESET_FILTERS: 'RESET_FILTERS',

    INCREMENT_VERSION:'INCREMENT_VERSION',
    CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',

    DELETE_TODO_START:'DELETE_TODO_START',
    DELETE_TODO_ERROR:'DELETE_TODO_ERROR',
    DELETE_TODO_SUCCESS:'DELETE_TODO_SUCCESS',

};

export const initialTodoState={
    todoList: [],
    error: '',
    filterError: '',
    isTodoListLoading: true,
    sortBy:'createdDate',
    sortDirection: 'asc',
    filterTerm: '',
    dataVersion: 0,
};

export function todoReducer(state,action){
    switch(action.type){
        case TODO_ACTIONS.FETCH_START:
            return{
                ...state,
                isTodoListLoading: true,
                error: '',
                filterError: '',
            };

        case TODO_ACTIONS.FETCH_SUCCESS:
            return{
                ...state,
                isTodoListLoading: false,
                todoList: action.payload.todos,
            };
        case TODO_ACTIONS.FETCH_ERROR:
            return{
                ...state,
                isTodoListLoading: false,
                error: action.payload.isFilterError ? '':action.payload.message,
                filterError: action.payload.isFilterError ? action.payload.message : '',
            };
        case TODO_ACTIONS.ADD_TODO_START:
            return{
                ...state,
            todoList:[action.payload.newTodo,...state.todoList], 
            error:'',
            filterError:'',
            };
        case TODO_ACTIONS.ADD_TODO_SUCCESS:
            return{
                ...state,
                todoList:state.todoList.map((todo)=>todo.id === action.payload.tmpId ? action.payload.confirmedTodo : todo),
            };
        case TODO_ACTIONS.ADD_TODO_ERROR:
            return{
                ...state,
                todoList: action.payload.rollbackList,
                error: action.payload.message,
            };
        case TODO_ACTIONS.COMPLETE_TODO_START:
            return{
                ...state,
                todoList: state.todoList.map((todo)=>
                todo.id ===action.payload.id? {...todo,isCompleted: !todo.isCompleted}:todo),
                error:'',
                filterError: '',
            };
        case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
            return{
                ...state,
                todoList: state.todoList.map((todo)=>
                todo.id ===action.payload.confirmedTodo.id ? action.payload.confirmedTodo : todo),
                
            };
        case TODO_ACTIONS.COMPLETE_TODO_ERROR:
            return{
                ...state,
                todoList: action.payload.rollbackList,
                error: action.payload.message,
            };
        case TODO_ACTIONS.UPDATE_TODO_START:
            return{
                ...state,
                todoList:state.todoList.map((todo)=>
                todo.id === action.payload.id ? {...todo, title: action.payload.title}:todo),
                error: '',
                filterError:'',
            };
        case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
            return{
                ...state,
                todoList: state.todoList.map((todo)=>todo.id === action.payload.confirmedTodo.id 
            ? action.payload.confirmedTodo :todo ),
            };
        case TODO_ACTIONS.UPDATE_TODO_ERROR:
            return{
                ...state,
                todoList: action.payload.rollbackList,
                error: action.payload.message,
            };
        case TODO_ACTIONS.SET_SORT:
            return{
                ...state,
                sortBy: action.payload.sortBy,
                sortDirection: action.payload.sortDirection,
                dataVersion: state.dataVersion +1,
            };
        case TODO_ACTIONS.SET_FILTER:
            return {
                ...state,
                filterTerm: action.payload.filterTerm,
            };
        case TODO_ACTIONS.CLEAR_ERROR:
            return{
                ...state,
                error:'',
            };
        case TODO_ACTIONS.CLEAR_FILTER_ERROR:
            return{
                ...state,
                filterError:'',
            };
        case TODO_ACTIONS.RESET_FILTERS:
            return{
                ...state,
                sortBy:"createdDate",
                sortDirection: 'asc',
                filterTerm: '',
                dataVersion:state.dataVersion+1,

            };
        case TODO_ACTIONS.INCREMENT_VERSION:
            return{
                ...state,
                dataVersion:state.dataVersion+1
            };

        case TODO_ACTIONS.DELETE_TODO_START:
            return{
                ...state,
                todoList: state.todoList.filter(todo=>todo.id !== action.payload.id)
            };
        case TODO_ACTIONS.DELETE_TODO_SUCCESS:
            return state;
        case TODO_ACTIONS.DELETE_TODO_ERROR:
            return{
                ...state,
                todoList:action.payload.rollbackList,
                error:action.payload.message
            };

            default:
                throw new Error(`Unknown action type: ${action.type}`);
    }
}