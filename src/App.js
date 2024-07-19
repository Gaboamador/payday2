import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import $ from 'jquery'
import Header from './componentes/header';
import Home from './componentes/home'
import Payday2Randomizer from './componentes/randomizer';
import BuildSelector from './componentes/selector';
import ProfileConstructor from './componentes/constructor';
import Builder from './componentes/builder';
import BuildSelectorNew from './componentes/selectorNew';
import BigOil from './componentes/bigoil';
import { BsChevronUp } from "react-icons/bs";


function App() {

  $(document).ready(function(){

    $('.ir-arriba').click(function(){
      $('body, html').animate({
        scrollTop: '0px'
      }, 300);
    });

    $(window).scroll(function(){
      if( $(this).scrollTop() > 0 ){
        $('.ir-arriba').slideDown(300);
      } else {
        $('.ir-arriba').slideUp(300);
      }
    });

  });

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
      <Route path="/bigOil" element={<BigOil/>}></Route>
    </Routes>
    <span className="ir-arriba">
      <BsChevronUp/>
    </span>
</Router>

    </div>
  );
}

export default App;
