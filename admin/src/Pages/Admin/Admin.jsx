import React from "react";
import './Admin.css';
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import Orders from "../../Components/Oders/Orders";
import Messages from "../../Components/Messages/Messages";



const Admin = () => {
    return (
        <div className="admin">
            <Sidebar/>
            <Routes>
                <Route path='/addproduct' element={<AddProduct/>}/>
                <Route path='/listproduct' element={<ListProduct/>}/>
                <Route path='/vieworders' element={<Orders/>}/>
                <Route path='/messages' element={<Messages/>}/>
            </Routes>

        </div>
    )
    
}

export default Admin;

