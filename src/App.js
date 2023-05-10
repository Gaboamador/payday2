import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './componentes/header';
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
