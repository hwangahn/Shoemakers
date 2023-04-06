import { useContext, useEffect, useState } from 'react';
import './app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { FloatButton } from 'antd';
import HomeView from './home';
import GoodsView from './goods';
import ShoeView from './shoe';
import LoginView from './login';
import RegisterView from './register';
import Cart from './cart';

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
          <Route exact path='/cart' Component={Cart} />
        </Routes>
        <FloatButton.BackTop visibilityHeight={100} />
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