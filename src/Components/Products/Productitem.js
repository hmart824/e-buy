import React, { useState } from 'react';
import Style from './Productitem.module.css';
import { AiFillStar } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";
import { useContextValue } from '../../Context/CustomContext';

function Productitem(props) {
  const {addToCart , removeProduct , handleDecrease ,handleIncrease } = useContextValue();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleAddToCart = async()=>{
    setAdding(true);
    const added = await addToCart(props.product);
    if(added){
      setAdding(false)
    }
  }
  const handleRemoveFromCart = async()=>{
    setRemoving(true);
    const removed = await removeProduct({id: props.product.id , doc_id: props.product.doc_id});
    if(removed){
      setRemoving(false);
    }
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
                  <AiFillMinusCircle onClick={()=> handleDecrease(props.product.id)} className='mx-2' style={{cursor: 'pointer'}}/>
                   {props.product.qty} 
                  <AiFillPlusCircle onClick={()=> handleIncrease(props.product.id)} className='mx-2' style={{cursor: 'pointer'}}/>
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