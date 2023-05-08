import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-gm7u55v7jisqivq4.us.auth0.com"
    clientId="YF49GD9OiTsFcBxsSJw650hwDuP2y0uX"
    authorizationParams={{
      /*redirect_uri: window.location.origin*/
      redirect_uri: "https://gaboamador.github.io/payday2"
    }}
  >
    <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
