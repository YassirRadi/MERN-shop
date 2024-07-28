import React, { useState } from 'react';
import './AddProduct.css';
import upload from '../../assets/upload.png';

const AddProduct = () => {
  // To change the image on upload button
  const [image, setImage] = useState(false);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  // Connect to backend
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'donuts',
    price: '',
    description: ''
  });

  const [alertType, setAlertType] = useState('');

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_product = async () => {
    // Check if any field is empty
    if (
        !productDetails.name ||
        !productDetails.price ||
        !productDetails.description ||
        !productDetails.category ||
        !image
    ) {
        setAlertType('error');
        setTimeout(() => {
            setAlertType('');
        }, 3000);
        return; // Exit the function early if any field is empty
    }

    // Proceed with adding the product
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product', image);

    // Connect to the backend to upload image
    await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
        body: formData,
    })
        .then((resp) => resp.json())
        .then((data) => {
            responseData = data;
        });

    if (responseData.success) {
        product.image = responseData.image_url;

        // Connect to the backend to add product
        await fetch('http://localhost:4000/addproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setAlertType('success');
                    setTimeout(() => {
                        setAlertType('');
                        // Clear the fields after success
                        setProductDetails({
                            name: '',
                            image: '',
                            category: 'donuts',
                            price: '',
                            description: ''
                        });
                    }, 3000);
                } else {
                    setAlertType('error');
                    setTimeout(() => {
                        setAlertType('');
                    }, 3000);
                }
            });
    }
};


  return (
    <div className='add-product'>
      {alertType && (
        <div
          className={`alert ${
            alertType === 'error' ? 'alert-error' : 'alert-success'
          }`}
        >
          {alertType === 'error'
            ? 'Please Fill All The Fields'
            : 'Food Item Added Successfully'}
        </div>
      )}
      <div className='addproduct-itemfield'>
        <p>Food Name</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type='text'
          name='name'
          placeholder='Type here'
        />
      </div>

      <div className='addproduct-price'>
        <div className='addproduct-itemfield'>
          <p>Price</p>
          <input
            value={productDetails.price}
            onChange={changeHandler}
            type='text'
            name='price'
            placeholder='Type here'
          />
        </div>
      </div>

      <div className='addproduct-itemfield'>
        <p>Description</p>
        <input
          value={productDetails.description}
          onChange={changeHandler}
          type='text'
          name='description'
          placeholder='Type here'
        />
      </div>

      <div className='addproduct-itemfield'>
        <p>Food Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name='category'
          className='add-product-selector'
        >
          <option value='donuts'>Donuts</option>
          <option value='cupcakes'>Cup Cakes</option>
          <option value='iclairs'>Iclairs</option>
        </select>
      </div>

      <div className='addproduct-itemfield'>
        <p>Upload Image</p>
        <label htmlFor='file-input'>
          <img
            src={image ? URL.createObjectURL(image) : upload}
            alt=''
            className='addproduct-thumbnail-img'
          />
        </label>
        <input
          onChange={imageHandler}
          type='file'
          name='image'
          id='file-input'
          hidden
        />
      </div>
      <button onClick={() => Add_product()} className='addproduct-btn'>
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
