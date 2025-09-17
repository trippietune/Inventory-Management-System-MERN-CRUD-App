import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Products from './components/Products';
import InsertProduct from './components/InsertProduct';
import UpdateProduct from './components/UpdateProduct';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <div className="App">
      <Router>
        
        <AuthProvider>
          <ProductProvider>
            <Navbar title="IMS" about="About" />
            <Routes>
              {/* Home route */}
              <Route exact path="/" element={<Home />} />
              
              {/* Product routes */}
              <Route path="/products" element={<Products />} />
              <Route path="/insertproduct" element={<InsertProduct />} />
              <Route path="/updateproduct/:id" element={<UpdateProduct />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
