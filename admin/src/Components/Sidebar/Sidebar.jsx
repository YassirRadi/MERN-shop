import React, { useState } from "react";
import './Sidebar.css';
import { Link } from 'react-router-dom';
import add_product_icon from '../../assets/add.png';
import list_product_icon from '../../assets/list.png';
import orders_icon from '../../assets/box.png'; 
import message from '../../assets/message.png';

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState(null);

    const handleItemClick = (index) => {
        setActiveItem(index);
    };

    return (
        <div className="sidebar">
            <Link to={'/addproduct'} style={{textDecoration: 'none'}}>
                <div className={`sidebar-item ${activeItem === 0 ? 'clicked' : ''}`} onClick={() => handleItemClick(0)}>
                    <img src={add_product_icon} alt="Add Product" />  
                    <p>Add Food</p>  
                </div>            
            </Link>

            <Link to={'/listproduct'} style={{textDecoration: 'none'}}>
                <div className={`sidebar-item ${activeItem === 1 ? 'clicked' : ''}`} onClick={() => handleItemClick(1)}>
                    <img src={list_product_icon} alt="List Product" />  
                    <p>List Foods</p>  
                </div>            
            </Link>

            <Link to={'/vieworders'} style={{textDecoration: 'none'}}>
                <div className={`sidebar-item ${activeItem === 2 ? 'clicked' : ''}`} onClick={() => handleItemClick(2)}>
                    <img className="order-i"src={orders_icon} alt="View Orders" />  
                    <p className="order-p">Orders</p>  
                </div>            
            </Link>

            <Link to={'/messages'} style={{textDecoration: 'none'}}>
                <div className={`sidebar-item ${activeItem === 3 ? 'clicked' : ''}`} onClick={() => handleItemClick(3)}>
                    <img className="message-i"src={message} alt="Messages" />  
                    <p className="message-p">Messages</p>  
                </div>            
            </Link>
        </div>
    );
}

export default Sidebar;
