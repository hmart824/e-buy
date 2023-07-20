import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import db from "../../Firbase/Firebase";
import { query , collection , orderBy , doc , updateDoc , getDocs , addDoc , deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const initialState = {
    cart: [],
    total: 0
};

/* The `getCartProducts` function is an asynchronous thunk action that is used to fetch the initial
state of the cart from the Firebase Firestore database. */
export const getCartProducts = createAsyncThunk("cart/getInitialState" , async(args , {getState})=>{
    try{
        const { user } = getState().userReducer;
        const q = query(collection(db , 'cart' , user.email , 'list') , orderBy('timestamp' , 'desc'));
        const querySnapshot = await getDocs(q);
        const cartProducts = querySnapshot.docs.map((doc)=>{
            return {
                doc_id: doc.id,
                ...doc.data()
            }
        });
        return cartProducts;
    }catch(error){
        console.log(error)
    }
});

export const addToCartAsync = createAsyncThunk("cart/addToCartAsync" , async(product , {getState})=>{
    const state = getState();
    let index = state.cartReducer.cart.findIndex((el)=> el.id === product.id);
    if(index > -1){
            const updatedCart = state.cartReducer.cart.map((item)=>{
                if(item.id === product.id){
                    return {...item , qty: item.qty + 1};
                }
                return item;
            });

            // update th prouct if already present in db
            const productRef = doc(db , 'cart' , state.userReducer.user.email , 'list' , updatedCart[index].doc_id);
            await updateDoc(productRef, {qty:  updatedCart[index].qty});
            return updatedCart;
        }else{
            let modifiedProduct = {...product , in_cart: true , qty: 1 , timestamp: Date.now()}

            //add the product in db
            const productRef = collection(db , 'cart' , state.userReducer.user.email , 'list');
            const docRef = await addDoc(productRef , modifiedProduct);
            return [{...modifiedProduct , doc_id: docRef.id} , ...state.cartReducer.cart];
        }
});

/* The `removeFromCartAsync` function is an asynchronous thunk action that is used to remove a product
from the cart. */
export const removeFromCartAsync = createAsyncThunk("cart/removeFromCartAsync" , async (doc_id , {getState})=>{
    const {user} = getState().userReducer;
    await deleteDoc(doc(db , 'cart' , user.email , 'list' , doc_id));
    return doc_id;
});

export const handleIncreaseAsync = createAsyncThunk("cart/handleIncreaseAsync" , async(id , {getState})=>{
    const {cartReducer , userReducer} = getState();
    // Find the index of the item in the cart
    let index = cartReducer.cart.findIndex((el) => el.id === id);

    if (index !== -1) {
      // Increase the quantity
      const updatedCart = cartReducer.cart.map((item)=>{
        if(item.id === id){
            return {...item , qty: item.qty + 1};
        }
        return item;
        });
      const productRef = doc(db, 'cart', userReducer.user.email, 'list', updatedCart[index].doc_id);

      try {
        // Update the document in Firebase
        await updateDoc(productRef, { qty: updatedCart[index].qty });

        // Return the updated cart and total to be handled automatically by Redux Toolkit
        return {
          cart: updatedCart,
          total: cartReducer.total + updatedCart[index].price,
        };
      } catch (error) {
        // Handle any errors that occur during the update
        console.error('Error updating cart item:', error);
        throw error; // Rethrow the error to let Redux Toolkit handle it
      }
    }
});

export const handleDecreaseAsync = createAsyncThunk("cart/handleDecreaseAsync" , async (id , {getState})=>{
    const { cartReducer , userReducer } = getState();

    // Find the index of the item in the cart
    let index = cartReducer.cart.findIndex((el) => el.id === id);

    if (index !== -1) {
      // Decrease the quantity
      let updatedCart = cartReducer.cart.map((item)=>{
        if(item.id === id){
            return {...item , qty: item.qty - 1};
        }
        return item;
      });
      let updatedTotal = cartReducer.total - updatedCart[index].price;

      const productRef = doc(db, 'cart', userReducer.user.email, 'list', updatedCart[index].doc_id);

      try {

        if (updatedCart[index].qty === 0) {
            
            // Delete the document from Firebase
            await deleteDoc(doc(db, 'cart', userReducer.user.email, 'list', updatedCart[index].doc_id));

            // Remove the item from the cart
            updatedCart = updatedCart.filter((item) => item.id !== id);
            toast.warning("Item removed successfully.");
        }else{
            // Update the document in Firebase
            await updateDoc(productRef, { qty: updatedCart[index].qty });
        }
        // Return the updated cart and total to be handled automatically by Redux Toolkit
        return {
          cart: updatedCart,
          total: updatedTotal
        };
      } catch (error) {
        // Handle any errors that occur during the update
        console.error('Error updating cart item:', error);
        throw error; // Rethrow the error to let Redux Toolkit handle it
      }
    }
});


/* The `clearCartAsync` function is an asynchronous thunk action that is used to clear the cart by
deleting all the products from the Firebase Firestore database. */
export const clearCartAsync = createAsyncThunk("cart/clearCartAsync" , async(args , {getState})=>{
    const {cartReducer , userReducer} = getState();
    cartReducer.cart.forEach(async(product)=>{
        await deleteDoc(doc(db , 'cart' , userReducer.user.email , 'list' , product.doc_id));
    });
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        calcTotalPrice: (state , action)=>{
            const total = state.cart.reduce((accum , currVal)=>{
                let {price , qty} = currVal;
                return accum + Number(price)*Number(qty);
            } , 0);
            state.total = total.toFixed(2);
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(getCartProducts.fulfilled , (state , action)=>{
            state.cart = [...action.payload];
        })
        .addCase(addToCartAsync.fulfilled , (state , action)=>{
            state.cart = [...action.payload];
        })
        .addCase(removeFromCartAsync.fulfilled , (state , action)=>{
            state.cart = state.cart.filter((item)=> item.doc_id !== action.payload);
        })
        .addCase(handleIncreaseAsync.fulfilled , (state , action)=>{
            state.cart = [...action.payload.cart];
            state.total = action.payload.total;
        })
        .addCase(handleDecreaseAsync.fulfilled , (state , action)=>{
            state.cart = [...action.payload.cart];
            state.total = action.payload.total;
        })
        .addCase(clearCartAsync.fulfilled , (state)=>{
            state.cart = [];
        })
    }

});

export const cartReducer = cartSlice.reducer;

export const cartActions = cartSlice.actions;

//selector
export const cartSelector = (state)=> state.cartReducer;