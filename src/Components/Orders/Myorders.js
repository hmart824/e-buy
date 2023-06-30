import React  from 'react';
import { useContextValue } from '../../Context/CustomContext';
import { getDate } from '../../Utils/util_functions';

function Myorders() {
  const { orders , user } = useContextValue();
  
  return (
    <div className="container text-center">
      <h1 className='my-2'>{user.displayName}'s Orders</h1>
      {orders.length < 1 && <h3>No Orders Right Now</h3>}
      {orders.map((order , index)=>{
        return <div key={index} className="order my-4">
                  <h3 className='my-2'>Yours Order on:- {getDate(order.purchased_on)}</h3>
                    <table className="table table-bordered my-1">
                      <thead>
                        <tr>
                          <th scope="col">Title</th>
                          <th scope="col">Price</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Total</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {order.products.map((product)=>{
                          return <tr key={product.id}>
                                    <td>{product.title.slice(0,32)}</td>
                                    <td>{product.price}</td>
                                    <td>{product.qty}</td>
                                    <td>{product.price * product.qty}</td>
                                  </tr>
                        })}
                        
                        <tr>
                          <td colSpan={3}></td>
                          <td className='fw-bold'>$ {order.total_price.toFixed(2)}</td>
                        </tr>
                        
                      </tbody>
                    </table>
                </div>
      })}
    </div>
  )
}

export default Myorders