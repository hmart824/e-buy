import React, { useEffect, useState } from 'react';
import Style from './Home.module.css';
import Productitem from '../Products/Productitem';
import { useContextValue } from '../../Context/CustomContext';
import { FiFilter } from "react-icons/fi";
import Filter from '../Filter/Filter';

function Home() {
    const { fetchProducts , transformedProducts , fetchcartProducts , user} = useContextValue();
    const [showFilter, setShowFilter] = useState(false);

    //call the fetch products function
    useEffect(() => {
        fetchProducts();
        if(user){
            fetchcartProducts();
        }
    }, []);


  return (
    <div className={Style.container}>
        <button type="button" className={Style.btn + " btn btn-primary"}
                style={{'--bs-btn-padding-y': '.25rem' , '--bs-btn-padding-x': '.5rem' ,  '--bs-btn-font-size': '.75rem'}}
                onClick={()=> setShowFilter(!showFilter)}>
            <FiFilter className='mx-1'/>
            Filter
        </button>
        {showFilter && <Filter/>}
        
        {transformedProducts().map((product)=>{
            return <Productitem key={product.id} product={product}/>
        })}
    </div>
  )
}

export default Home