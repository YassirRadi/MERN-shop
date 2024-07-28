import React, { useContext } from "react";
import './ProductDisplay.css';
import { ShopContext } from "../../Context/ShopContext";
import { assets } from "../../assets/assets";


const ProductDisplay = (props) => {

    const {product} = props;
    const {cartItems, addToCart, removeFromCart} = useContext(ShopContext);

    return(
        <div className="productdisplay">
            <div className="display">
            <img className="productdisplay-main-img" src={product.image} alt="" />
           
           <div className="productdisplay-right">
               <h1>{product.name}</h1>
               <div className="productdisplay-right-price"><strong>Rs.{product.price}.00</strong></div>

               <div className="productdisplay-right-description">
                   {product.description}
               </div>
               <p className="productdisplay-right-category"><span>Category :</span>{product.category}</p>

               {!cartItems[product.id]
                    ?<button className="addtocart" onClick={()=>addToCart(product.id)}>ADD TO CART</button>:
                    <div className="food-item-counter">
                        <img onClick={()=>removeFromCart(product.id)} src={assets.remove_icon_red} alt="" />
                        <p>{cartItems[product.id]}</p>
                        <img onClick={()=>addToCart(product.id)} src={assets.add_icon_green} alt="" />
                    </div>
               }

           </div>

            </div>
            

        </div>
    )
}

export default ProductDisplay;