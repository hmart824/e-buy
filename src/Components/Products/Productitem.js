import React from 'react';
import Style from './Productitem.module.css';
import { AiFillStar } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";
import { useContextValue } from '../../Context/CustomContext';

function Productitem(props) {
  const {addToCart , removeProduct} = useContextValue();
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
                  <AiFillPlusCircle className='mx-2' style={{cursor: 'pointer'}}/>
                   {props.product.qty} 
                  <AiFillMinusCircle className='mx-2' style={{cursor: 'pointer'}}/>
                </span> :
                <span className='mx-3' style={{fontSize: '1rem'}}>
                  {props.product.rating.rate} <AiFillStar style={{color:'#ffff00'}}/>
                </span>
              }
            </h5>
               
            <button className={(props.product.in_cart ? "btn-danger" : "btn-primary") + " btn position-absolute"} style={{bottom: '1rem'}} 
            onClick={()=>{
              props.product.in_cart ? removeProduct(props.product.id) : addToCart(props.product)
            }}>
              {props.product.in_cart ? 'Remove From Cart' : 'Add to Cart'}
            </button>
        </div>
    </div>
  )
}

export default Productitem