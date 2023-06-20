import React from 'react';
import axios from'axios';
import { createContext , useContext , useReducer} from 'react';

const customContext = createContext();

const reducer = (state , action)=>{
    const {payload} = action;
    switch(action.type){
        case "GET_DATA":
            return {
                ...state,
                [payload.state]: payload.value
            };

        default: 
        return state;
    }
}

const useContextValue = ()=>{
    const context = useContext(customContext);
    return context;
}

function CustomContext({children}) {
    const [state, dispatch] = useReducer(reducer, {products: []});

    const fetchProducts = async()=>{
        const res = await axios.get('https://fakestoreapi.com/products');
        dispatch({
            type: 'GET_DATA',
            payload: {
                state: 'products',
                value: res.data
            }
        })
    }
  return (
    <customContext.Provider value={{
        products: state.products,
        fetchProducts
    }}>
        {children}
    </customContext.Provider>
  )
}

export default CustomContext;
export {useContextValue};