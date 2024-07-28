import React from 'react';
import './AllCategory.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const AllCategory = () => {
  return (
    <div className='all-category'>
      <Link to = '/donuts'>
      <div className="card card1" >
            <img src={assets.donut} alt="" />
            <div className="name">
                <b>Donuts</b>
            </div> 
        </div>
      </Link>
        

        <Link to='/cupcakes'>
        <div className="card card2">
            <img src={assets.cupcake} alt="" />
            <div className="name">
                <b>Cup Cakes</b>
            </div> 
        </div>
        </Link>
        
        <Link to='/iclairs'>
        <div className="card card3">
            <img src={assets.iclairs} alt="" />
            <div className="name">
                <b>Eclairs</b>
            </div> 
        </div>
        </Link>
        
      
    </div>
  )
}

export default AllCategory
