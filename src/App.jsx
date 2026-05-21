import './App.css'
import Header from './shared/Header';
import TodosPage from './features/Todos/TodosPage';
import Logon from './features/Logon';
import { useState } from 'react';
  

function App() {
  const [_email, setEmail]=useState("");
  const [token, setToken]=useState("");

  return(
    <div>
      <Header token={token} onSetToken={setToken} onSetEmail={setEmail}/>
      {token ? (
      <TodosPage token={token}/>
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken}/>
      )
    }
    </div>
  );
};

export default App;
