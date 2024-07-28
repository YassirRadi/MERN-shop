import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {

  const [popular_food_list, setPopularFoodList] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:4000/popular')
    .then((response)=>response.json())
    .then((data)=>setPopularFoodList(data));
  },[])
  
  return (
    <div className='popular'>
        <h1>POPULAR OF THE WEEK</h1>
        <hr />
        <div className="popular-item">
          {popular_food_list.map((item, i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price}/>
          })}
        </div>
      
    </div>
  )
}

export default Popular
