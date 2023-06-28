import React, { useEffect, useState } from 'react';
import Style from './Filter.module.css'
import { useContextValue } from '../../Context/CustomContext';

function Filter() {
  const {getUniqueData , products , category ,setFilterQuery , price} = useContextValue();
  const [selectedCategory, setSelectedCategory] = useState([]);
  
  //get the unique category
  useEffect(() => {
    getUniqueData(products , 'category');
  }, []);

  

  useEffect(() => {
    setFilterQuery({selectedCategory , type: 'category'});
  }, [selectedCategory]);

  //push the selected category to selectedCategory array to filter
  const handleSelectedCategory = (category)=>{
    if(selectedCategory.includes(category)){
      let filteredCategory = selectedCategory.filter((el)=> el !== category)
      setSelectedCategory(filteredCategory);
    }else{
      setSelectedCategory([...selectedCategory, category]);
    }
  }
  
  return (
    <form className={Style.formContainer}>
      <label htmlFor="price">Price : {price}</label>
      <input type="range" id="price" name="price" min="0" max="1000" step="10" value={price} onChange={(e)=> setFilterQuery(Number(e.target.value))}/>
      <div className={Style.category}>
        <h3>Category</h3>
        {category?.map((el , index)=>{
          return  <div className={Style.inp} key={index} >
                    <input type="checkbox" name={el} id={'category-'+ index} onChange={()=> handleSelectedCategory(el)}/>
                    <label htmlFor={'category-'+ index}>{el}</label>
                  </div>
        })}
      </div>
    </form>
  )
}

export default Filter;