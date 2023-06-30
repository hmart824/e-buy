import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Style from './Cart.module.css';
import { useContextValue } from '../../Context/CustomContext';
import Productitem from '../Products/Productitem';

function Cart() {
  const {cart , calcTotalPrice , total , onPurchase } = useContextValue();
  const [purchasing, setPurchasing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    calcTotalPrice(cart);
  }, [cart])

  const handlePurchase = async()=>{
    setPurchasing(true);
    const Purchased = onPurchase();
    if(Purchased){
      setPurchasing(false);
      navigate('/orders');
    }
  }
  
  return (
    <>
    <div className={Style.container}>
      {cart?.length < 1 && <h2>Cart is Empty.</h2>}
      {cart?.map((product)=>{
        return <Productitem key={product.id} product={product}/>
      })}

    </div>
      <div className="navbar sticky-bottom bg-body-tertiary" style={{bottom: '8px' , borderTop: '1px solid black' , borderBottom: '1px solid black'}}>
        <div className="container-fluid">
          <p className={Style.price}>${total.toFixed(2)}</p>
          <button className='btn btn-success btn-sm' disabled={(cart.length === 0 ? true : '') || (purchasing ? true : '')}
          onClick={handlePurchase}
          >{purchasing ? "Purchasing..." : "Purchase"}</button>
        </div>
      </div>
    </>
  )
}

export default Cart