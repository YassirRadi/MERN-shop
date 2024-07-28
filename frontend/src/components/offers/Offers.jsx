import React from 'react';
import './Offers.css'
import { assets } from '../../assets/assets';

const Offers = () => {
  return (
    <div className='offer'>
      <div className="offers">
        <div className="offers-left">
                  <h1>Best</h1>
                  <h1>Deals For You</h1>
                  <p>ONLY FOR COMBO'S</p>
                  <button>Check Now</button>
        </div>
        <div className="offers-right">
            <img src={assets.offer} alt="" />
        </div>

      </div>
        
    </div>
  )
}

export default Offers
