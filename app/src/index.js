import './app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import HomeView from './home';
import GoodsView from './goods';
import ShoeView from './shoe';
import LoginView from './login';
import RegisterView from './register';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' Component={HomeView} />
          <Route exact path='/gender/:gender' Component={GoodsView} />
          <Route exact path='/shoe/:sid' Component={ShoeView} />
          <Route exact path='/login' Component={LoginView} />
          <Route exact path='/register' Component={RegisterView} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);