import './output.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Login from './components/login.jsx'
import Signup from './components/signup.jsx';
import Login1 from './components/login1.jsx';
import Verify from './components/verify.jsx';
import Home from './components/home.jsx';
import Dashboard from './components/dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/login1' element={<Login1/>}/>
    <Route path='verify' element={<Verify/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
