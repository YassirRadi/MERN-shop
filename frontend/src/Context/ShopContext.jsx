import React, {createContext, useEffect, useState} from "react";
//import { food_list } from "../assets/assets";


export const ShopContext = createContext(null);

const getDefaultCart = () =>{
    let cart = {};
    for(let index=0; index< 300+1; index++){
        cart[index] = 0;
    }

    return cart;
}



const ShopContextProvider = (props) =>{

    const [food_list, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    const clearCart = () => {
        setCartItems({});
      };

    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data));

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data));
        }
    },[])
   

    const addToCart = (itemId) =>{
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev, [itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
            if(localStorage.getItem('auth-token')){
                fetch('http://localhost:4000/addtocart', {
                    method:'POST',
                    headers:{
                        Accept:'application/form-data',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({'itemId':itemId}),
                })
                .then((response)=>response.json())
                .then((data)=>console.log(data));
            }
        }
        
    }

    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart', {
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({'itemId':itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }


    useEffect(()=>{
        console.log(cartItems);
    },[cartItems])

    const getTotalCartAmount = ()=>{
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = food_list.find((product)=>product.id===item)
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }


    const getTotalCartItems =() => {
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item] >0){
                totalItem += cartItems[item];
            }
        }

        return totalItem;
    }

    const contextValue = {clearCart, setCartItems, getTotalCartAmount, food_list, cartItems, addToCart, removeFromCart, getTotalCartItems};

    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;