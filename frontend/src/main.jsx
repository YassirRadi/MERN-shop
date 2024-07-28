import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {BrowserRouter} from 'react-router-dom';
import ShopContextProvider from './Context/ShopContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // To get react router support in the app component -> BrowserRouter
  <ShopContextProvider>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </ShopContextProvider>
  
)
