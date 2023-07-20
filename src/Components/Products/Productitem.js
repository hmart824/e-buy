import React, { useState } from 'react';
import Style from './Productitem.module.css';
import { useDispatch } from 'react-redux';
import { AiFillStar } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";
import { 
  addToCartAsync , 
  removeFromCartAsync , 
  handleIncreaseAsync, 
  handleDecreaseAsync 
} from '../../Redux/Reducers/CartReducer';
import { toast } from 'react-toastify';

function Productitem(props) {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleAddToCart = ()=>{
    setAdding(true);
    dispatch(addToCartAsync(props.product))
    .then(()=>{
      toast.success("Item added to cart successfully.");
      setAdding(false);
    })
  }
  const handleRemoveFromCart = async()=>{
    setRemoving(true);
    dispatch(removeFromCartAsync(props.product.doc_id))
    .then(()=>{
      toast.warning("Item removed from cart successfully.");
      setRemoving(false);
    })
  }

  return (
    <div className={Style.item + " card"} style={props.product.in_cart && {height: '25rem'}}>
        <img src={props.product.image} className={Style.img + " card-img-top"} alt={props.product.title}/>
        <div className="card-body position-relative">
            <h5 className="card-title">{props.product.title.slice(0,32)}...</h5>
            {!props.product.in_cart && <p className="card-text">{props.product.description.slice(0,60)}...</p>}
            <h5 className='position-absolute' style={{bottom: '3.5rem'}}>
              ${props.product.price} 
              {props.product.in_cart ? 
                <span className='mx-4'>
                  <AiFillMinusCircle onClick={()=> dispatch(handleDecreaseAsync(props.product.id))} className='mx-2' style={{cursor: 'pointer'}}/>
                   {props.product.qty} 
                  <AiFillPlusCircle onClick={()=> dispatch(handleIncreaseAsync(props.product.id))} className='mx-2' style={{cursor: 'pointer'}}/>
                </span> :
                <span className='mx-3' style={{fontSize: '1rem'}}>
                  {props.product.rating.rate} <AiFillStar style={{color:'#ffff00'}}/>
                </span>
              }
            </h5>
               
            <button className={(props.product.in_cart ? "btn-danger" : "btn-primary") + " btn position-absolute"} style={{bottom: '1rem'}} 
            onClick={()=>{
              props.product.in_cart ? handleRemoveFromCart() : handleAddToCart()
            }}
            disabled={(adding || removing) ? true : ''}
            >
              {props.product.in_cart ? (removing ? 'Removing...' : 'Remove From Cart') : (adding ? "Adding..." : 'Add to Cart')}
            </button>
        </div>
    </div>
  )
}

export default Productitem