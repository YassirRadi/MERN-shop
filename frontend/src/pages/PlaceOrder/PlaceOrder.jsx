import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Make sure to set the root element for accessibility

const PlaceOrder = () => {
  const { getTotalCartAmount, food_list, cartItems, clearCart } = useContext(ShopContext);
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    deliveryMethod: 'Paid Online',
  });
  const [errors, setErrors] = useState({});
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(data).forEach(key => {
      if (!data[key]) {
        newErrors[key] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async () => {
    if (validateForm()) {
      let orderItems = [];
      food_list.forEach((item) => {
        if (cartItems[item.id] > 0) {
          let itemInfo = { ...item, quantity: cartItems[item.id] };
          orderItems.push(itemInfo);
        }
      });

      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 99,
      };

      const token = localStorage.getItem('auth-token');

      if (data.deliveryMethod === 'Paid Online') {
        navigate('/paymentportal', { state: { orderData } });
      } else {
        orderData.payment = false;

        await fetch('http://localhost:4000/placeorder', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth-token': token,
          },
          body: JSON.stringify(orderData),
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setIsPlaceModalOpen(false); // Close the modal
            setIsSuccessModalOpen(true); // Open the success modal
            clearCart();
          } else {
            alert("Error Placing Order");
          }
        });
      }
    }
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (data.deliveryMethod === 'Cash On Delivery') {
        setIsPlaceModalOpen(true);
      } else {
        placeOrder();
      }
    }
  };

  const closePlaceModal = () => {
    setIsPlaceModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/');
  };

  return (
    <form className='place-order' onSubmit={handlePlaceOrder}>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>

        <div className='multi-fields'>
          <input
            type="text"
            name="firstName"
            placeholder='First Name'
            value={data.firstName}
            onChange={onChangeHandler}
            className={errors.firstName ? 'error' : ''}
          />
          <input
            type="text"
            name="lastName"
            placeholder='Last Name'
            value={data.lastName}
            onChange={onChangeHandler}
            className={errors.lastName ? 'error' : ''}
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder='Email Address'
          value={data.email}
          onChange={onChangeHandler}
          className={errors.email ? 'error' : ''}
        />
        <input
          type="text"
          name="street"
          placeholder='House Number'
          value={data.street}
          onChange={onChangeHandler}
          className={errors.street ? 'error' : ''}
        />

        <div className='multi-fields'>
          <input
            type="text"
            name="city"
            placeholder='Street Name'
            value={data.city}
            onChange={onChangeHandler}
            className={errors.city ? 'error' : ''}
          />
          <input
            type="text"
            name="state"
            placeholder='City'
            value={data.state}
            onChange={onChangeHandler}
            className={errors.state ? 'error' : ''}
          />
        </div>
        <div className='multi-fields'>
          <input
            type="text"
            name="zipCode"
            placeholder='Zip Code'
            value={data.zipCode}
            onChange={onChangeHandler}
            className={errors.zipCode ? 'error' : ''}
          />
          <input
            type="text"
            name="country"
            placeholder='Province'
            value={data.country}
            onChange={onChangeHandler}
            className={errors.country ? 'error' : ''}
          />
        </div>
        <input
          type="text"
            name="phone"
            placeholder='Phone'
            value={data.phone}
            onChange={onChangeHandler}
            className={errors.phone ? 'error' : ''}
        />

        <div className='paymentmethod'>
          <p>Payment Option: </p>
          <select
            name="deliveryMethod"
            value={data.deliveryMethod}
            onChange={onChangeHandler}
          >
            <option value="Paid Online">Online Payment</option>
            <option value="Cash On Delivery">Cash On Delivery</option>
          </select>
        </div>
      </div>

      <div className="place-order-right">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>Rs.{getTotalCartAmount()}.00</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Rs.{getTotalCartAmount() === 0 ? 0 : 99}.00</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Rs.{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 99}.00</h3>
            </div>
          </div>
          <button type="submit">
            {data.deliveryMethod === 'Cash On Delivery' 
              ? 'PLACE ORDER' 
              : 'PROCEED TO PAY'}
          </button>
        </div>
      </div>

      {data.deliveryMethod === 'Cash On Delivery' && (
        <Modal
          isOpen={isPlaceModalOpen}
          onRequestClose={closePlaceModal}
          contentLabel="Place Order"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h3>Please confirm the order</h3>
          <div className="confirmbuttons">
            <button onClick={placeOrder}>Confirm</button>
            <button onClick={closePlaceModal}>Cancel</button>
          </div>
        </Modal>
      )}

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
    </form>
  );
};

export default PlaceOrder;
