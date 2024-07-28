import React, { useState } from 'react';
import './Item.css';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './Item.css'; // Import modal CSS here

const Item = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (e) => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      e.preventDefault(); // Prevent navigation
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Link to={`/product/${props.id}`} onClick={handleItemClick}>
        <div className='item'>
          <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt="" />
          <div className="description">
            <p>{props.name}</p>
            <div className='item-price'>Rs.{props.price}.00</div>
          </div>
        </div>
      </Link>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Login Required"
        className="modal1"
        overlayClassName="modal-overlay"
      >
        <h2>Please Login</h2>
        <p>Login to view this product</p>
        <div className="buttons">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </>
  );
};

export default Item;
