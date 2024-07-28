import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { ShopContext } from '../../Context/ShopContext';
import './Payment.css'; // Import the CSS file

Modal.setAppElement('#root'); // Make sure to set the root element for accessibility

const Payment = () => {
  const { clearCart } = useContext(ShopContext);
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [expire, setExpire] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state?.orderData;
  const token = localStorage.getItem('auth-token');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    // Simulate payment processing (you should replace this with real payment processing logic)
    const isPaymentSuccessful = true; // Simulate successful payment

    if (isPaymentSuccessful) {
      // Add payment field to orderData
      const orderDataWithPayment = { ...orderData, payment: true };

      await fetch('http://localhost:4000/placeorder', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify(orderDataWithPayment),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsConfirmModalOpen(false);
          setIsSuccessModalOpen(true);
          clearCart();
        } else {
          alert("Error Placing Order");
        }
      });
    } else {
      alert('Payment Failed');
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/');
  };

  return (
    <div className="payment-container">
      <form className="payment-form" onSubmit={handleSubmit}>
        <h3>Payment Information</h3>
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Expire"
          value={expire}
          onChange={(e) => setExpire(e.target.value)}
          required
        />
        <input
          type="submit"
          value="Submit"
        />
      </form>

      {/* Confirm Payment Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirm Payment"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>Please confirm your payment</h3>
        <div className="confirmbuttons">
          <button onClick={handleConfirmPayment}>Confirm</button>
          <button onClick={closeConfirmModal}>Cancel</button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeSuccessModal}
        contentLabel="Order Placed"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>Order Placed Successfully</h3>
        <button className='ok' onClick={closeSuccessModal}>OK</button>
      </Modal>
    </div>
  );
};

export default Payment;
