import React, { useEffect, useState } from 'react';
import Style from './Home.module.css';
import Productitem from '../Products/Productitem';
import { useContextValue } from '../../Context/CustomContext';
import { FiFilter } from "react-icons/fi";

function Home() {
    const {products , fetchProducts} = useContextValue();
    const [showFilter, setShowFilter] = useState(false);
    useEffect(() => {
        fetchProducts();
    }, []);

  return (
    <div className={Style.container}>
        <button type="button" className={Style.btn + " btn btn-primary"}
                style={{'--bs-btn-padding-y': '.25rem' , '--bs-btn-padding-x': '.5rem' ,  '--bs-btn-font-size': '.75rem'}}>
            <FiFilter className='mx-1' onClick={()=> setShowFilter(!showFilter)}/>
            Filter
        </button>
        
        {products?.map((product)=>{
            return <Productitem key={product.id} product={product}/>
        })}
    </div>
  )
}

export default Home