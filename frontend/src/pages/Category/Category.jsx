import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Category.css';
import { ShopContext } from '../../Context/ShopContext';
import Item from '../../components/Item/Item';

const Category = (props) => {
  const { food_list } = useContext(ShopContext);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className='category'>
      <div className="category-menu">
        <Link
          to="/donuts"
          className={`b1 ${selectedCategory === 'donuts' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('donuts')}
        >
          Donuts
        </Link>
        <Link
          to="/cupcakes"
          className={`b2 ${selectedCategory === 'cupcakes' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('cupcakes')}
        >
          Cupcakes
        </Link>
        <Link
          to="/iclairs"
          className={`b3 ${selectedCategory === 'iclairs' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('iclairs')}
        >
          Eclairs
        </Link>
      </div>
      <div className="category-products">
        {food_list.map((item, index) => {
          if (props.category === item.category) {
            return <Item key={index} id={item.id} name={item.name} image={item.image} price={item.price} />;
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default Category;
