import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          navigate('/login'); 
          return;
        }

        const response = await axios.get('http://localhost:4000/myorders', {
          headers: {
            'auth-token': token
          }
        });
        setOrders(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="my-orders">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="cards">
          <div className="card-header">
            <p>Order ID</p>
            <p>Amount</p>
            <p>Status</p>
            <p>Date</p>
            <p>Items</p>
          </div>
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <p>No:&nbsp; {order.orderId}</p>
              <p>${order.amount}</p>
              <p><span>&#x25cf;&nbsp;</span>{order.status}</p>
              <p>{new Date(order.date).toLocaleDateString()}</p>
              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p><strong>Name:</strong> {item.name}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
