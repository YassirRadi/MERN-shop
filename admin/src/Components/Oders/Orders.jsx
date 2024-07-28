import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); 

  const fetchAllOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/vieworders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } 
      else {
        alert("Error fetching orders");
      }
    } 
    catch (error) {
      console.error("Error:", error);
      alert("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    if (event.target.value === 'Delivered') {
      setSelectedOrder(orderId);
      setIsModalOpen(true);
    } else {
      try {
        const response = await fetch('http://localhost:4000/status', {
          method: 'POST', 
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
            status: event.target.value,
          }),
        });

        const data = await response.json();

        if (data.success) {
          await fetchAllOrders();
        } else {
          alert("Error updating order status");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error updating order status");
      }
    }
  };

  const confirmRemoveOrder = async () => {
    try {
      const response = await fetch('http://localhost:4000/status', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder,
          status: 'Delivered',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(orders.filter(order => order._id !== selectedOrder));
        setIsModalOpen(false);
        setSelectedOrder(null);
        setSuccessMessage(`Order No.${selectedOrder} successfully removed.`);
        setTimeout(() => setSuccessMessage(''), 3000); // Hide the message after 3 seconds
      } else {
        alert("Error updating order status");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating order status");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <p>No.{order.orderId}</p>
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">{order.address.firstName + " " + order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street + ", "}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipCode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>Rs.{order.amount}.00</p>
            <p>Payment: {order.address.deliveryMethod}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Order Processing">Order Processing</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Order Removal"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Order Completed</h2>
        <p>Do you want to remove this order from the list?</p>
        <div className="modal-buttons">
          <button onClick={confirmRemoveOrder} className='yes'>Yes</button>
          <button onClick={closeModal} className='no'>No</button>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
