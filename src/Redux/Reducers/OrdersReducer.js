import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import db from "../../Firbase/Firebase";
import { query , collection , getDocs , addDoc , orderBy } from "firebase/firestore";

const initialState = {
    orders: []
};

/* The `getOrders` function is an asynchronous thunk action creator. It is used to fetch the initial
state of orders from a Firebase database. */
export const getOrders = createAsyncThunk("orders/getInitialState" , async(args , {getState})=>{
    try{
        const { user } = getState().userReducer;
        const q = query(collection(db , 'orders' , user.email , 'list') , orderBy('purchased_on' , 'desc'));
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map((doc)=>{
            return {
                doc_id: doc.id,
                ...doc.data()
            }
        });
        return orders;
    }catch(error){
        console.log(error)
    }
});

/* The `onPurchaseAsync` function is an asynchronous thunk action creator. It is used to perform an
asynchronous operation of adding a new order to the Firebase database. */
export const onPurchaseAsync = createAsyncThunk("orders/onPurchaseAsync" , async (args , {getState})=>{
    const { cartReducer , userReducer } = getState();
    let purchasedObj = {
        purchased_on: Date.now(),
        products: cartReducer.cart,
        total_price: cartReducer.total
    };
    const orderRef = collection(db , 'orders' , userReducer.user.email , 'list');
    await addDoc(orderRef , purchasedObj);
    return purchasedObj;
});

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(getOrders.fulfilled , (state , action)=>{
            state.orders = [...action.payload];
        })
        .addCase(onPurchaseAsync.fulfilled , (state , action)=>{
            state.orders = [action.payload , ...state.orders];
        })
    }
});

export const ordersReducer = ordersSlice.reducer;

//selector
export const ordersSelector = (state)=> state.ordersReducer;