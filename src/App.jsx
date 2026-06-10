import './App.css'
import Header from './shared/Header';
import TodosPage from './pages/TodosPage';
import Logon from './features/Logon';
import { Routes,Route } from 'react-router';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
  

function App() {
  
  return(
    <div>
      <Header />
      <Routes>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/profile' element={<RequireAuth><ProfilePage/></RequireAuth>}/>
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
      
    </div>
  );
};

export default App;
