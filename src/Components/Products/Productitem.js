import React from 'react';
import Style from './Productitem.module.css';
import { Link } from 'react-router-dom';

function Productitem(props) {
  return (
    <div className={Style.item + " card"} style={{width: '16rem'}}>
        <img src={props.image} className={Style.img + " card-img-top"} alt={props.title}/>
        <div className="card-body position-relative">
            <h5 className="card-title">{props.title.slice(0,32)}...</h5>
            <p className="card-text">{props.description.slice(0,60)}...</p>
            <h5 className='position-absolute' style={{bottom: '3.5rem'}}>${props.price} <span>{props.rating}</span> </h5>
            <Link to="/" className="btn btn-primary position-absolute" style={{bottom: '1rem'}}>Add to Cart</Link>
        </div>
    </div>
  )
}

export default Productitem