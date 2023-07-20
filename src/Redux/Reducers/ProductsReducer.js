import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    products: [],
    category: []
}

/* The code `export const getProducts = createAsyncThunk("products/getInitialState" , async()=>{ const
res = await axios.get('https://fakestoreapi.com/products'); return res.data; });` is creating an
asynchronous thunk action called `getProducts`. */
export const getProducts = createAsyncThunk("products/getInitialState" , async()=>{
    const res = await axios.get('https://fakestoreapi.com/products');
    return res.data;
});

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        getCategory: (state , action)=>{
            state.category = [...action.payload];
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(getProducts.fulfilled , (state , action)=>{
            state.products = [...action.payload];
        })
    }
});

export const productsReducer = productsSlice.reducer;

export const productsActions = productsSlice.actions;

//selector
export const productsSelector = (state) => state.productsReducer;