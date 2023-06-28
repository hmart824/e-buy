import React , {useEffect} from 'react';
import { useContextValue } from '../../Context/CustomContext';

function Myorders() {
  const { orders , fetchOrders } = useContextValue();
  useEffect(() => {
    fetchOrders();
  }, []);
  
  return (
    <div className="container text-center">
      <h1 className='my-2'>Your Orders</h1>
      {orders.map((order)=>{
        return <div className="order">
                  <h3 className='my-1'>Yours Order on:- {order.purchased_on}</h3>
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
                        <tr>
                          <td>1</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <td colSpan={3}></td>
                          <td>12000</td>
                        </tr>
                        
                      </tbody>
                    </table>
                </div>
      })}
    </div>
  )
}

export default Myorders