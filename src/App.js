import { useAuth0 } from "@auth0/auth0-react";
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './componentes/header';
import LoginButton from './componentes/login';
import LogoutButton from './componentes/logout';
import Profile from './componentes/profile';
import Home from './componentes/home'
import Payday2Randomizer from './componentes/randomizer';


function App() {
  
  return (
    <div className="App">
      
<Router>
  <Header/>
  <Routes>
      <Route exact path="/" element={<Home/>}></Route>
      <Route path="/randomizer" element={<Payday2Randomizer/>}></Route>
      <Route path="/profile" element={<Profile/>}></Route>
    </Routes>
</Router>

    </div>
  );
}

export default App;
