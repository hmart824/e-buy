import React, { createContext , useContext , useReducer } from 'react';
import axios from'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import db , { auth } from '../Firbase/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword , updateProfile , onAuthStateChanged , signOut} from "firebase/auth";
import { collection , addDoc, getDocs , setDoc , doc} from 'firebase/firestore';

const customContext = createContext();

const reducer = (state , action)=>{
    const {payload} = action;
    switch(action.type){
        case "TOTAL":
        case "SET_DATA":
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
    const [state, dispatch] = useReducer(reducer, {products: [] , cart: [] , total: 0 , filtered_products: [] , category: [] , user: null , loading: false});

    const signUpWithEmailAndPassword = (data)=>{
        dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: true}});
        createUserWithEmailAndPassword(auth , data.email , data.password)
        .then(async(userCredential)=>{
            console.log('signed up successfully!!')
            await updateProfile(userCredential.user , {
                displayName: data.name
            });
            const currentUser = {
                displayName: userCredential.user.displayName,
                email: userCredential.user.email,
                photoURL: userCredential.user.photoURL,
                userId: userCredential.user.uid,
                password: data.password
            }
            const userDocRef = doc(db , "users" , currentUser.email);
            setDoc(userDocRef , currentUser);
            dispatch({
                type: 'SET_DATA' , 
                payload: {
                  state: 'user',
                  value: currentUser
                }});
            dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: false}});
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
            toast.error('Invalid Credentials!!')
            dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: false}});
        });
        
    }

    const signIn = (data)=>{
        dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: true}});
        const message = signInWithEmailAndPassword(auth , data.email , data.password)
        .then((userCredential)=>{
            const currentUser = {
                displayName: userCredential.user.displayName,
                email: userCredential.user.email,
                photoURL: userCredential.user.photoURL,
                userId: userCredential.user.uid,
                password: data.password
            }
            dispatch({
                type: 'SET_DATA' , 
                payload: {
                  state: 'user',
                  value: currentUser
                }});
            dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: false}});
        })
        .catch((error) => {
            const errorMessage = error.message;
            toast.error('Invalid Credentials!!')
            dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: false}});
            return errorMessage;
        });
        return message;
    }

    const authentication = ()=>{
        dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: true}});
        onAuthStateChanged(auth, (currentUser) => {
           if (currentUser) {
            const user = {
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                userId: currentUser.uid,
            }
            dispatch({
                type: 'SET_DATA' , 
                payload: {
                  state: 'user',
                  value: user
                }});
             console.log('usersigned in');
           }else{
             console.log("user signed out");
           }
           dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: false}});
         });
    
    }

    const signout = ()=>{
        signOut(auth)
        .then(()=>{
          console.log('signed out successfully');
          dispatch({
            type: 'SET_DATA',
            payload: {
              state: 'user',
              value: null
            }
           })
        })
        .catch((err)=>{alert(err.message)})
      }

    const filterProducts = (query)=>{
        let temp = [...state.products];
        let tempProd;

        if(typeof query === 'object'){
                tempProd = query?.map((cat)=>{
                let filterTemp = temp.filter((el)=> el.category === cat)
                return filterTemp;
            })
            tempProd = tempProd.flat()
        }

        if(typeof query === 'string'){
            // state.filtered_products.length > 0 ?
            // temp = [...state.filtered_products] :
            // temp = [...state.products]
            tempProd = temp.filter((el)=> el.title.toLowerCase().includes(query));
        }

        dispatch({
            type: 'SET_DATA',
            payload: {
                state: 'filtered_products',
                value: tempProd
            }
        })
    }

    const fetchProducts = async()=>{
        // dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: true}});
        const res = await axios.get('https://fakestoreapi.com/products');
        dispatch({
            type: 'SET_DATA',
            payload: {
                state: 'products',
                value: res.data
            }
        })
        // dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: false}});
    };

    const addToCart = (product)=>{
        let index = state.cart.findIndex((el)=> el.id === product.id);
        if(index > -1){
            state.cart[index].qty++;
            dispatch({
                type: 'SET_DATA',
                payload: {
                    state: 'cart',
                    value: state.cart
                }
            });
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

    const handleIncrease = (id)=>{
        let index = state.cart.findIndex((el)=> el.id === id);
        if(index !== -1){
            state.cart[index].qty++;
            dispatch({
                type: 'SET_DATA',
                payload: {
                    state: 'cart',
                    value: state.cart
                }
            });
            dispatch({
                type: 'TOTAL',
                payload:{
                    state: 'total',
                    value: state.total + state.cart[index].price
                }
            })
        }
        return;
    }
    const handleDecrease = (id)=>{
        let index = state.cart.findIndex((el)=> el.id === id);
        if(index !== -1){
            state.cart[index].qty--;
            dispatch({
                type: 'TOTAL',
                payload:{
                    state: 'total',
                    value: state.total - state.cart[index].price
                }
            })
            if(state.cart[index].qty === 0){
                state.cart.splice(index , 1);
            }
            dispatch({
                type: 'SET_DATA',
                payload: {
                    state: 'cart',
                    value: state.cart
                }
            });
        }
        return;

    }

    const calcTotalPrice = (array)=>{
        const total = array.reduce((accum , currVal)=>{
            let {price , qty} = currVal;
            return accum + Number(price)*Number(qty);
        } , 0);
        dispatch({
            type: 'TOTAL',
            payload:{
                state: 'total',
                value: total
            }
        })
    }

    const getUniqueData = (itemArray , property)=>{
        let data = itemArray.map((item)=>{
            return item[property];
        })
        data = [...new Set(data)];
        dispatch({
            type: 'SET_DATA',
            payload: {
                state: property,
                value: data
            }
        })
    }

    const onChangeHandler = (target ,state, setState)=>{
        setState({...state , [target.name] : target.value});
    }

    const clearInputs = (className)=>{
        let lists = document.getElementsByClassName(className);
        Array.from(lists).forEach((el)=>{
            el.value = '';
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
        calcTotalPrice,
        handleIncrease,
        handleDecrease,
        getUniqueData,
        category: state.category,
        filterProducts,
        filtered_products: state.filtered_products,
        clearInputs,
        onChangeHandler,
        signUpWithEmailAndPassword,
        authentication,
        user: state.user,
        signout,
        loading: state.loading,
        signIn
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