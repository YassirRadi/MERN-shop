import React, { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { useParams } from 'react-router-dom';
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay';

const Product = () => {
    const { food_list } = useContext(ShopContext);
    const { productId } = useParams();
    
    const product = food_list.find((e) => e.id === productId);

    return (
        <div>
            <ProductDisplay product={product} />
        </div>
    );
}

export default Product;
