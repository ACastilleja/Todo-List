import './App.css'
import Header from './shared/Header';
import TodosPage from './pages/TodosPage';
import Logon from './features/Logon';
import { Routes,Route } from 'react-router';
import AboutPage from './pages/AboutPage';
  

function App() {
  
  return(
    <div>
      <Header />
      <Routes>
        <Route path='/about' element={<AboutPage/>}/>
      </Routes>
      
    </div>
  );
};

export default App;
