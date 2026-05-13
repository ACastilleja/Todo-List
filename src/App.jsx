
import { useState } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';



  

function App() {
  const [todoList, setTodoList]=useState([]);

  const addTodo = (todoTitle)=>{

    const newTodo = {id:Date.now(), title: todoTitle, isCompleted: false };
    setTodoList(previous=>[newTodo,...previous])

  }
  const completeTodo = (id)=>{
    const updatedTodoList = todoList.map((todo)=>{
      if (todo.id === id){
        return {...todo, isCompleted: true};
      }
      return todo;
    });
    setTodoList(updatedTodoList);

  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
      
    </div>
  )
}

export default App
