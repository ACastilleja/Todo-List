
import { useState } from 'react'
import './App.css'
import TodoList from './TodoList'
import TodoForm from './TodoForm'



  

function App() {
  const [todoList, setTodoList]=useState([]);

  const addTodo = (todoTitle)=>{

    const newTodo = {id:Date.now(), title: todoTitle, isCompleted: false };
    setTodoList(previous=>[newTodo,...previous])

  }
  function completeTodo () {



  }
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList}/>
      
    </div>
  )
}

export default App
