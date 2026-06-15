
import Header from './shared/Header';
import TodosPage from './pages/TodosPage';
import { Routes,Route } from 'react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import RequireAuth from './components/RequireAuth';
  

function App() {
  
  return(
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/todos' element={<RequireAuth><TodosPage/></RequireAuth>}/>
        <Route path='/profile' element={<RequireAuth><ProfilePage/></RequireAuth>}/>
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
      
    </div>
  );
};

export default App;
