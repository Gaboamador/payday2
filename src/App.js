import logo from './logo.svg';
import './App.css';
import LoginButton from './componentes/login';
import LogoutButton from './componentes/logout';
import Profile from './componentes/profile';
import Payday2Randomizer from './componentes/randomizer';

function App() {
  return (
    <div className="App">
      <header>
      </header>
  {/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
  
      <LoginButton/>
      <LogoutButton/>
      <Profile/>
  */}
      <Payday2Randomizer/>
    </div>
  );
}

export default App;
