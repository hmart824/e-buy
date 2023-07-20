import React from 'react';
import Style from './Filter.module.css';
import { useSelector , useDispatch } from 'react-redux';
import { filterSelector , filterActions } from '../../Redux/Reducers/FilterReducers';
import { productsSelector } from '../../Redux/Reducers/ProductsReducer';

function Filter() {
  const{ price , filterCategory } = useSelector(filterSelector);
  const { category } = useSelector(productsSelector);
  const dispatch = useDispatch();

  //push the selected category to selectedCategory array to filter
  const handleSelectedCategory = (cat)=>{
    if(filterCategory.includes(cat)){
      dispatch(filterActions.removeFromCategory(cat));
    }else{
      dispatch(filterActions.addTofilterCategory(cat));
    }
  }
  
  return (
    <form className={Style.formContainer}>
      <label htmlFor="price">Price : {price}</label>
      <input type="range" id="price" name="price" min="0" max="1000" step="10" value={price} onChange={(e)=> dispatch(filterActions.setPrice(Number(e.target.value)))}/>
      <div className={Style.category}>
        <h3>Category</h3>
        {category?.map((el , index)=>{
          return  <div className={Style.inp} key={index} >
                    <input type="checkbox" name={el} id={'category-'+ index} onChange={()=> handleSelectedCategory(el)} checked={filterCategory.includes(el)}/>
                    <label htmlFor={'category-'+ index}>{el}</label>
                  </div>
        })}
      </div>
    </form>
  )
}

export default Filter;