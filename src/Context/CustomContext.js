import React, { createContext , useContext , useReducer } from 'react';
import axios from'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { reducer , filterReducer } from '../Reducer/Reducers';

import db , { auth } from '../Firbase/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword , updateProfile , onAuthStateChanged , signOut, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { collection , addDoc, getDocs , setDoc , doc, updateDoc , query, orderBy, deleteDoc} from 'firebase/firestore';


const customContext = createContext();

//custom hook for custom context
const useContextValue = ()=>{
    const context = useContext(customContext);
    return context;
}

function CustomContext({children}) {
    const [state, dispatch] = useReducer(reducer, {products: [] , cart: [] , total: 0 , category: [] , user: null , loading: false , orders:[]});

    const [filterState , filterDispatch] = useReducer(filterReducer , {price: 1000, category: [] , searchQuery: ''});


    //signup funtion
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

            //store user info in db
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
            toast.error('Invalid Credentials!!')
            dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: false}});
        });
        
    }

    const signInWithGoogle = ()=>{
        dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: true}});
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth , provider)
        .then((userCredential)=>{
            const currentUser = {
                displayName: userCredential.user.displayName,
                email: userCredential.user.email,
                photoURL: userCredential.user.photoURL,
                userId: userCredential.user.uid
            }
            //store user info in db
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
            toast.error('Invalid Credentials!!');
            dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: false}});
        })
    }

    //signin funtion
    const signIn = (data)=>{
        dispatch({type: 'SET_DATA' , payload: {state: 'loading' , value: true}});
        signInWithEmailAndPassword(auth , data.email , data.password)
        .then((userCredential)=>{
            const currentUser = {
                displayName: userCredential.user.displayName,
                email: userCredential.user.email,
                photoURL: userCredential.user.photoURL,
                userId: userCredential.user.uid
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
        });
    }

    //check authentication whether a user signed in or not
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

    //sign out function
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

    //filter fuction
    const setFilterQuery = (query)=>{
        if(typeof query === 'object' && query.type === 'category'){
            filterDispatch({
                type: "SET_CATEGORY",
                payload: query.selectedCategory
            })
        }

        if(typeof query === 'string'){
            filterDispatch({
                type: "SET_SEARCHQUERY",
                payload: query
            })
        }

        if(typeof query === 'number'){
            filterDispatch({
                type: "SET_PRICE",
                payload: query
            })
        }
    }

    const transformedProducts = ()=>{
        let { price , category , searchQuery} = filterState;
        let filteredProducts = [...state.products];
        if(price){
            filteredProducts = filteredProducts.filter((el)=> Number(el.price) <= filterState.price);
        }
        if(category.length > 0){
            let temp = filterState.category.map((cat)=>{
                let tempProds = filteredProducts.filter((el)=> el.category === cat);
                return tempProds;
            })
            filteredProducts = temp.flat();
        }
        if(searchQuery){
            filteredProducts = filteredProducts.filter((el)=> el.title.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        return filteredProducts;
    }

    //fecth products from api
    const fetchProducts = async()=>{
        const res = await axios.get('https://fakestoreapi.com/products');
        dispatch({
            type: 'SET_DATA',
            payload: {
                state: 'products',
                value: res.data
            }
        })
    };

    //fetch cart products from db
    const fetchcartProducts = async()=>{
        try{
            const q = query(collection(db , 'cart' , state.user.email , 'list') , orderBy('timestamp' , 'desc'));
            const querySnapshot = await getDocs(q);
            const cartProducts = querySnapshot.docs.map((doc)=>{
                return {
                    doc_id: doc.id,
                    ...doc.data()
                }
            });
            dispatch({
                type: 'SET_DATA',
                payload: {
                    state: 'cart',
                    value: cartProducts
                }
            });
        }catch(error){
            console.log(error)
        }
    };
    const fetchOrders = async()=>{
        try{
            const q = query(collection(db , 'orders' , state.user.email , 'list'));
            const querySnapshot = await getDocs(q);
            const orders = querySnapshot.docs.map((doc)=>{
                return {
                    doc_id: doc.id,
                    ...doc.data()
                }
            });
            dispatch({
                type: 'SET_DATA',
                payload: {
                    state: 'orders',
                    value: orders
                }
            });
        }catch(error){
            console.log(error)
        }
    };

    //add to cart function
    const addToCart = async (product)=>{
        let index = state.cart.findIndex((el)=> el.id === product.id);
        if(index > -1){
            state.cart[index].qty++;

            //update th prouct if already present in db
            const productRef = doc(db , 'cart' , state.user.email , 'list' , state.cart[index].doc_id);
            await updateDoc(productRef, {qty:  state.cart[index].qty});
            dispatch({
                type: 'SET_DATA',
                payload: {
                    state: 'cart',
                    value: state.cart
                }
            });
            dispatch({type: "SET_DATA" , payload: {state: 'isAdding' , value: false}});
        }else{
            let modifiedProduct = {...product , in_cart: true , qty: 1 , timestamp: Date.now()}

            //add the product in db
            const productRef = collection(db , 'cart' , state.user.email , 'list');
            const docRef = await addDoc(productRef , modifiedProduct)
            dispatch({
                type: 'ADD_DATA',
                payload: {
                    state: 'cart',
                    value: {...modifiedProduct , doc_id: docRef.id}
                }
            });
        }
        toast.success('Added to cart successfully.')
        return true;
    }

    //remove product fron cart
    const removeProduct = async({id , doc_id})=>{
        await deleteDoc(doc(db , 'cart' , state.user.email , 'list' , doc_id));
        dispatch({
            type: 'REMOVE_DATA',
            payload:{
                state: 'cart',
                id
            }
        })
        toast.error('Item Removed successfully.');
        return true;
    }

    //increase qty of product in cart
    const handleIncrease = async(id)=>{
        let index = state.cart.findIndex((el)=> el.id === id);
        if(index !== -1){
            state.cart[index].qty++;
            const productRef = doc(db , 'cart' , state.user.email , 'list' , state.cart[index].doc_id);
            await updateDoc(productRef, {qty:  state.cart[index].qty});
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

    //decrease qty of product in cart
    const handleDecrease = async(id)=>{
        let index = state.cart.findIndex((el)=> el.id === id);
        if(index !== -1){
            state.cart[index].qty--;
            const productRef = doc(db , 'cart' , state.user.email , 'list' , state.cart[index].doc_id);
            await updateDoc(productRef, {qty:  state.cart[index].qty});
            dispatch({
                type: 'TOTAL',
                payload:{
                    state: 'total',
                    value: state.total - state.cart[index].price
                }
            })
            if(state.cart[index].qty === 0){
                await deleteDoc(doc(db , 'cart' , state.user.email , 'list' , state.cart[index].doc_id));
                state.cart.splice(index , 1);
                toast.error('Item removed.')
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

    //alculate the total price in cart
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

    //used to get all unique data from an array
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

    const onPurchase = async()=> {
        let purchaseObj = {
            purchased_on: Date.now(),
            products: state.cart,
            total_price: state.total
        }
        state.cart.forEach(async(product)=>{
            await deleteDoc(doc(db , 'cart' , state.user.email , 'list' , product.doc_id));
        })
        const orderRef = collection(db , 'orders' , state.user.email , 'list');
        await addDoc(orderRef , purchaseObj);
        dispatch({type: "SET_DATA" , payload: {state: 'cart' , value: []}});
        dispatch({type: "ADD_DATA" , payload: {state: 'orders' , value: purchaseObj}});
        return true;
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
        setFilterQuery,
        signUpWithEmailAndPassword,
        signInWithGoogle,
        authentication,
        user: state.user,
        signout,
        loading: state.loading,
        signIn,
        fetchcartProducts,
        price: filterState.price,
        transformedProducts,
        onPurchase,
        orders: state.orders,
        fetchOrders
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