import React, { useEffect, useState } from 'react';
import './Latest.css'
//import { latest } from '../../assets/assets';
import Item from '../Item/Item';

const Latest = () => {

  const [latest, setLatest] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:4000/latest')
    .then((response)=>response.json())
    .then((data)=>setLatest(data));

  },[])

  return (
    <div className='latest'>
      <h1>LATEST CARVINGS</h1>
      <hr />
      <div className="latest_items">
        {latest.map((item, i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price}/>
        })}
      </div>
    </div>
  )
}

export default Latest;
