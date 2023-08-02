import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './componentes/header';
import Home from './componentes/home'
import Payday2Randomizer from './componentes/randomizer';
import BuildSelector from './componentes/selector';
import ProfileConstructor from './componentes/constructor';
import Builder from './componentes/builder';
import BuildSelectorNew from './componentes/selectorNew';


function App() {
  
  return (
    <div className="App">
      
<Router>
  <Header/>
  <Routes>
      <Route exact path="/" element={<Home/>}></Route>
      <Route path="/randomizer" element={<Payday2Randomizer/>}></Route>
      <Route path="/selector" element={<BuildSelector/>}></Route>
      <Route path="/constructor" element={<ProfileConstructor/>}></Route>
      <Route path="/builder" element={<Builder/>}></Route>
      <Route path="/selectorNew" element={<BuildSelectorNew/>}></Route>
    </Routes>
</Router>

    </div>
  );
}

export default App;
