import React, { useEffect } from 'react';
import Style from './Home.module.css';
import Productitem from '../Products/Productitem';
import { useContextValue } from '../../Context/CustomContext';
import { FiFilter } from "react-icons/fi";

function Home() {
    const {products , fetchProducts} = useContextValue();
    useEffect(() => {
        fetchProducts();
    }, [])
    console.log(products)

  return (
    <div className={Style.container}>
        <button type="button" className={Style.btn + " btn btn-primary"}
                style={{'--bs-btn-padding-y': '.25rem' , '--bs-btn-padding-x': '.5rem' ,  '--bs-btn-font-size': '.75rem'}}>
            <FiFilter className='mx-1'/>
            Filter
        </button>
        {products?.map((product)=>{
            return <Productitem 
                    key={product.id} 
                    title={product.title} 
                    image={product.image}
                    description={product.description}
                    price={product.price}
                    rating={product.rating}
                    />
        })}
    </div>
  )
}

export default Home