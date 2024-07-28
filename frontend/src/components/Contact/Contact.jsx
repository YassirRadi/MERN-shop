import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Contact.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token'); // Assuming you store the token in local storage
      await axios.post('http://localhost:4000/contact', formData, {
        headers: {
          'auth-token': token,
        },
      });
      setModalMessage('Message sent successfully!');
      setModalIsOpen(true);
      // Clear the form data
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setModalMessage('Failed to send message.');
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="c">
    <div className="contact-us">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      <div className="contact-info">
        <h3>Our Contact Information</h3>
        <p>Email: gonutswithdonuts@gmail.com</p>
        <p>Phone: +94 769028324</p>
        <p>Address: 123 Temple Street, Kadawatha, Sri Lanka</p>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Message Alert"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{modalMessage}</h2>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
    </div>
  );
};

export default ContactUs;
