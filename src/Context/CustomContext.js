import React from 'react';
import axios from'axios';
import { createContext , useContext , useReducer} from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const customContext = createContext();

const reducer = (state , action)=>{
    const {payload} = action;
    switch(action.type){
        case "TOTAL":
        case "GET_DATA":
            return {
                ...state,
                [payload.state]: payload.value
            };
        case "ADD_DATA":
            return{
                ...state,
                [payload.state]: [payload.value , ...state[payload.state]]
            }
        case "REMOVE_DATA":
            return{
                ...state,
                [payload.state]: state[payload.state].filter((el)=> el.id !== payload.id)
            }
        default: 
        return state;
    }
}

const useContextValue = ()=>{
    const context = useContext(customContext);
    return context;
}

function CustomContext({children}) {
    const [state, dispatch] = useReducer(reducer, {products: [] , cart: [] , total: 0});

    const fetchProducts = async()=>{
        const res = await axios.get('https://fakestoreapi.com/products');
        dispatch({
            type: 'GET_DATA',
            payload: {
                state: 'products',
                value: res.data
            }
        })
    };

    const addToCart = (product)=>{
        let index = state.cart.findIndex((el)=> el.id === product.id);
        if(index > -1){
            state.cart[index].qty++;
            dispatch({
                type: 'GET_DATA',
                payload: {
                    state: 'cart',
                    value: state.cart
                }
            });
            console.log();
        }else{
            dispatch({
                type: 'ADD_DATA',
                payload: {
                    state: 'cart',
                    value: {...product , in_cart: true , qty: 1}
                }
            });
        }
        toast.success('Added to cart successfully.')
    }

    const removeProduct = (id)=>{
        dispatch({
            type: 'REMOVE_DATA',
            payload:{
                state: 'cart',
                id
            }
        })
        toast.error('Item Removed successfully.')
    }

    const calcTotalPrice = (array)=>{
        let total = 0;
        array.forEach(element => {
            total = total + (element.price * element.qty)
        });
        console.log(total);
        dispatch({
            type: 'TOTAL',
            payload:{
                state: 'total',
                value: total
            }
        })
    }

  return (
    <customContext.Provider value={{
        products: state.products,
        fetchProducts,
        addToCart,
        cart: state.cart,
        toast,
        removeProduct,
        total: state.total,
        calcTotalPrice
    }}>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
      />
        {children}
    </customContext.Provider>
  )
}

export default CustomContext;
export {useContextValue};