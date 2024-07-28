import React, { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import { assets } from '../../assets/assets';
import './CartItems.css'
import { useNavigate } from 'react-router-dom';

const CartItems = () => {

    const {getTotalCartAmount, food_list, cartItems, removeFromCart} = useContext(ShopContext);

    const navigate = useNavigate();

  return (
    <div className="cart">

        <div className='cartitems'>

            <div className="cartitems-format-main">
                        <p>Products</p>
                        <p>Title</p>
                        <p>Price</p>
                        <p>Quantity</p>
                        <p>Total</p>
                        <p>Remove</p>
                    </div>
                    <hr />
                    {food_list.map((e)=>{
                        if(cartItems[e.id]>0)
                        {
                            return <div>
                                <div className=''></div>
                                        <div className="cartitems-format cartitems-format-main">
                                            <img src={e.image} alt="" className='carticon-product-icon' />
                                            <p>{e.name}</p>
                                            <p>Rs.{e.price}.00</p>
                                            <p>{cartItems[e.id]}</p>
                                            <p>Rs.{e.price*cartItems[e.id]}.00</p>
                                            <img className= 'carticon-remove-icon' src={assets.remove_icon_red} onClick={()=>{removeFromCart(e.id)}} alt="" />
                                        </div>
            
                            <hr />
                        </div>
                        }
                        return null;
                    })}
                    <div className="cartitems-down">
                        

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
                                    <p>Rs.{getTotalCartAmount()===0?0:99}.00</p>
                                </div>
                                <hr />
                                <div className="cartitems-total-item">
                                    <h3>Total</h3>
                                    <h3>Rs.{getTotalCartAmount()===0?0:getTotalCartAmount()+99}.00</h3>
                                </div>
                            </div>
                            <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
                        </div>
                    </div>
            
        </div>

    </div>
    
    )
}

export default CartItems
