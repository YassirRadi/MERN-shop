import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Cart from './pages/Cart/Cart'
import Footer from './components/Footer/Footer'
import AllCategory from './components/AllCategory/AllCategory'
import About from './components/About/About'
import Category from './pages/Category/Category'
import LoginSignup from './pages/LoginSignup/LoginSignup'
import Product from './pages/Product/Product'
import Payment from './pages/Payment/Payment'
import MyOrders from './pages/MyOrders/MyOrders'
import Contact from './components/Contact/Contact'

const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} /> 
        <Route path='/allcategory' element={<AllCategory/>} />
        <Route path='/donuts' element={<Category category="donuts"/>} />
        <Route path='/iclairs' element={<Category category="iclairs"/>} />
        <Route path='/cupcakes' element={<Category category="cupcakes"/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/login' element={<LoginSignup/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/order' element={<PlaceOrder/>} />
        <Route path='/track-order' element={<MyOrders/>} />
        <Route path='/paymentportal' element={<Payment/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path="/product" element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
      </Routes>

      <Footer/>

      
    </div>
  )
}

export default App

